pipeline {
    environment {
        DOCKERHUB_CRED = credentials("Ansh-Docker-Credentials")
        PATH = "/opt/homebrew/bin:$PATH"
    }
    agent any
    tools {nodejs "NODEJS"} 
    stages {
        stage("Stage 1: Git Clone") {
            steps {
                // sh '''
                // rm -rf SPE-FInal-Project
                // git clone https://github.com/AnshAviKhanna/PlateMate.git
                // '''
                git credentialsId: 'Ansh-GitHub-Credentials', url: 'https://github.com/AnshAviKhanna/PlateMate.git', branch: 'main'
            }
        }

        stage("Stage 2: Backend Testing") {
            steps {
                sh '''
                cd backend
                npm install
                npm install jest --save-dev
                npm test
                '''
            }
        }

        stage("Stage 3: Frontend Testing") {
            steps {
                sh '''
                cd frontend
                npm install
                npm install --save-dev @testing-library/react @testing-library/jest-dom
                npm test
                '''
            }
        }

        stage("Stage 4: Creating Docker Image for frontend") {
            steps {
                sh '''
                cd frontend
                ls
                /usr/local/bin/docker build -t anshavikhanna/frontend:latest .
                '''
            }
        }

        stage("Stage 5: Creating Docker Image for backend") {
            steps {
                sh '''
                cd backend
                /usr/local/bin/docker build -t anshavikhanna/backend:latest .
                '''
            }
        }

        stage("Stage 6: Push Frontend Docker Image") {
            steps {
                sh '''
                /usr/local/bin/docker login -u ${DOCKERHUB_CRED_USR} -p ${DOCKERHUB_CRED_PSW}
                /usr/local/bin/docker push anshavikhanna/frontend:latest
                '''
            }
        }

        stage("Stage 7: Push Backend Docker Image") {
            steps {
                sh '''
                /usr/local/bin/docker login -u ${DOCKERHUB_CRED_USR} -p ${DOCKERHUB_CRED_PSW}
                /usr/local/bin/docker push anshavikhanna/backend:latest
                '''
            }
        }

    }
}