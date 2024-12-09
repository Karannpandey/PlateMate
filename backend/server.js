// server/server.js
const express = require('express');
const cors = require('cors');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const MultiArmBandit = require('./models/multiArmBandit');
const logger = require('./logger.js');
const morgan = require('morgan');

logger.info("Server is starting...");


const morganFormat = ":method :url :status :response-time ms";

const app = express();
// app.use(cors());
app.use(express.json());


// const corsOptions = {
//   origin:'http://localhost:3000',
//   credentials:true
// }

// app.use(cors(corsOptions));

const corsOptions = {
  origin: ['http://localhost:3000', 'http://frontend:3000'],
  // origin: ['http://192.168.49.2:30008', 'http://frontend:30008'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// const corsOptions = {
//   origin: [
//     'http://localhost:3000', 
//     'http://localhost:30008', 
//     'http://my-react-app-service', 
//     'http://my-node-backend-service'
//   ],
//   credentials: true,
//   methods: ['GET', 'POST', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// };



app.use(cors(corsOptions));

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// Modified loadCSV function to work with mocked filesystem
function loadCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    // const mockData = [
    //   { Name: 'Oatmeal', Cluster: '0' },
    //   { Name: 'Pancakes', Cluster: '1' },
    //   { Name: 'Salad', Cluster: '0' },
    //   { Name: 'Sandwich', Cluster: '1' },
    //   { Name: 'Pasta', Cluster: '0' },
    //   { Name: 'Steak', Cluster: '1' }
    // ];
    const mockData = [
      { Name: 'Oatmeal', Cluster: '0', URL: 'https://www.allrecipes.com/' },
      { Name: 'Pancakes', Cluster: '1', URL: 'https://www.allrecipes.com/' },
      { Name: 'Salad', Cluster: '0', URL: 'https://www.allrecipes.com/' },
      { Name: 'Sandwich', Cluster: '1', URL: 'https://www.allrecipes.com/' },
      { Name: 'Pasta', Cluster: '0', URL: 'https://www.allrecipes.com/' },
      { Name: 'Steak', Cluster: '1', URL: 'https://www.allrecipes.com/' }
    ];
    
    
    // In test environment, return mock data
    if (process.env.NODE_ENV === 'test') {
      resolve(mockData);
      return;
    }

    // Original CSV loading logic
    fs.createReadStream(path.join(__dirname, 'data', filePath))
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

const bandits = new Map();
const dataFrames = new Map();

// Modified initializeData to handle test environment
async function initializeData() {
  const files = [
    'heart_breakfast_df.csv',
    'heart_lunch_df.csv',
    'heart_dinner_df.csv',
    'muscle_breakfast_df.csv',
    'muscle_lunch_df.csv',
    'muscle_dinner_df.csv'
  ];

  try {
    for (const file of files) {
      const data = await loadCSV(file);
      dataFrames.set(file, data);
      console.log(`Loaded ${file} with ${data.length} records`);
    }
    console.log('All data files loaded successfully');
    return true;
  } catch (error) {
    console.error('Error loading data files:', error);
    return false;
  }
}

// Server startup logic
if (process.env.NODE_ENV !== 'test') {
  initializeData().then(() => {
    const PORT = 5001;
    // const PORT = 8000;
    app.listen(PORT, () => {logger.info("Server is running on port 5001");
      console.log(`Server running on port ${PORT}`);});
  });
}

// Middleware to ensure data is loaded in tests
app.use(async (req, res, next) => {
  if (process.env.NODE_ENV === 'test' && dataFrames.size === 0) {
    await initializeData();
  }
  next();
});

app.post('/api/initialize', (req, res) => {
  const { userId, goal } = req.body;
  const prefix = goal === 1 ? 'muscle' : 'heart';
  
  const breakfastData = dataFrames.get(`${prefix}_breakfast_df.csv`);
  const lunchData = dataFrames.get(`${prefix}_lunch_df.csv`);
  const dinnerData = dataFrames.get(`${prefix}_dinner_df.csv`);
  
  const numClustersBreakfast = new Set(breakfastData.map(row => row.Cluster)).size;
  const numClustersLunch = new Set(lunchData.map(row => row.Cluster)).size;
  const numClustersDinner = new Set(dinnerData.map(row => row.Cluster)).size;

  bandits.set(`${userId}_breakfast`, new MultiArmBandit(1.0, numClustersBreakfast, 0.99));
  bandits.set(`${userId}_lunch`, new MultiArmBandit(1.0, numClustersLunch, 0.99));
  bandits.set(`${userId}_dinner`, new MultiArmBandit(1.0, numClustersDinner, 0.99));

  res.json({ message: 'Initialized successfully' });
});

app.post('/api/getMealPlan', (req, res) => {
  const { userId, goal } = req.body;
  const prefix = goal === 1 ? 'muscle' : 'heart';

  const breakfastBandit = bandits.get(`${userId}_breakfast`);
  const lunchBandit = bandits.get(`${userId}_lunch`);
  const dinnerBandit = bandits.get(`${userId}_dinner`);

  const breakfastData = dataFrames.get(`${prefix}_breakfast_df.csv`);
  const lunchData = dataFrames.get(`${prefix}_lunch_df.csv`);
  const dinnerData = dataFrames.get(`${prefix}_dinner_df.csv`);

  function getRandomRecipe(data, cluster) {
    // Filter data by the cluster value
    const clusterData = data.filter(row => row.Cluster.toString() === cluster.toString());
    
    // Select a random recipe from the filtered data
    const randomIndex = Math.floor(Math.random() * clusterData.length);
    
    // Get the Name and URL corresponding to the randomly selected recipe
    const recipe = clusterData[randomIndex];
    return {
      name: recipe.Name,  // Recipe Name
      url: recipe.URL     // URL corresponding to the recipe
    };
  }
  

  const breakfastCluster = breakfastBandit.choose_arm();
  const lunchCluster = lunchBandit.choose_arm();
  const dinnerCluster = dinnerBandit.choose_arm();

  const breakfastRecipe = getRandomRecipe(breakfastData, breakfastCluster);
  const lunchRecipe = getRandomRecipe(lunchData, lunchCluster);
  const dinnerRecipe = getRandomRecipe(dinnerData, dinnerCluster);

  // const mealPlan = {
  //   breakfast: {
  //     recipe: getRandomRecipe(breakfastData, breakfastCluster),
  //     cluster: breakfastCluster
  //   },
  //   lunch: {
  //     recipe: getRandomRecipe(lunchData, lunchCluster),
  //     cluster: lunchCluster
  //   },
  //   dinner: {
  //     recipe: getRandomRecipe(dinnerData, dinnerCluster),
  //     cluster: dinnerCluster
  //   }
  // };
  const mealPlan = {
    breakfast: {
      name: breakfastRecipe.name,
      url: breakfastRecipe.url,
      cluster: breakfastCluster
    },
    lunch: {
      name: lunchRecipe.name,
      url: lunchRecipe.url,
      cluster: lunchCluster
    },
    dinner: {
      name: dinnerRecipe.name,
      url: dinnerRecipe.url,
      cluster: dinnerCluster
    }
  };

  res.json(mealPlan);
});

app.post('/api/updateRatings', (req, res) => {
  const { userId, ratings } = req.body;
  
  const breakfastBandit = bandits.get(`${userId}_breakfast`);
  const lunchBandit = bandits.get(`${userId}_lunch`);
  const dinnerBandit = bandits.get(`${userId}_dinner`);

  breakfastBandit.update(ratings.breakfast.cluster, ratings.breakfast.rating);
  lunchBandit.update(ratings.lunch.cluster, ratings.lunch.rating);
  dinnerBandit.update(ratings.dinner.cluster, ratings.dinner.rating);

  breakfastBandit.decay_epsilon();
  lunchBandit.decay_epsilon();
  dinnerBandit.decay_epsilon();

  res.json({ message: 'Ratings updated successfully' });
});

module.exports = app;