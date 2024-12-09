pipeline{
    environment{
        DOCKERHUB_CRED = credentials("DockerKaran")
    }
    agent any
    stages{
        stage("Stage 1 : Git Clone") {
            steps {
                sh 'ls'
            }
        }

//comment
//cpomment

        // stage("Stage 2: Backend Testing") {
        //     steps {
        //         sh '''
        //         cd backend
        //         npm install
        //         npm i cors
        //         npm install jest --save-dev
        //         npm test
        //         '''
        //     }
        // }

        // stage("Stage 3: Frontend Testing") {
        //     steps {
        //         sh '''
        //         cd frontend
        //         npm install
        //         npm install --save-dev @testing-library/react @testing-library/jest-dom
        //         npm test
        //         '''
        //     }
        // }

        // stage("Stage 4: Creating Docker Image for frontend") {
        //     steps {
        //         sh '''
        //         cd frontend
        //         ls
        //         docker build -t krp277/platemate-frontend:latest .
        //         '''
        //     }
        // }

        // stage("Stage 5: Creating Docker Image for backend") {
        //     steps {
        //         sh '''
        //         cd backend
        //         docker build -t krp277/platemate-backend:latest .
        //         '''
        //     }
        // }

        // stage("Stage 6: Push Frontend Docker Image") {
        //     steps {
        //         sh '''
        //         docker login -u ${DOCKERHUB_CRED_USR} -p ${DOCKERHUB_CRED_PSW}
        //         docker push krp277/platemate-frontend:latest
        //         '''
        //     }
        // }

        // stage("Stage 7: Push Backend Docker Image") {
        //     steps {
        //         sh '''
        //         docker login -u ${DOCKERHUB_CRED_USR} -p ${DOCKERHUB_CRED_PSW}
        //         docker push krp277/platemate-backend:latest
        //         '''
        //     }
        // }

        stage("Stage 8: Ansible"){
            steps {
                sh '''
                ansible-playbook -i inventory-k8 playbook-k8.yaml
                '''
            }

        }
    }
}