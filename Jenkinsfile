pipeline{
    environment{
        DOCKERHUB_CRED = credentials("DockerKaran")
        REACT_APP_API_KEY = credentials("api_key")
        REACT_APP_API_APP_ID = credentials("api_app_id")
        VAULT_PASS = credentials("ansible_vault_pass")
    }
    agent any
    stages{
        stage("Stage 1 : Git Clone") {
            steps {
                sh '''
                rm -rf PlateMate
                git clone https://github.com/AnshAviKhanna/PlateMate.git
                '''
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

        // stage("Stage 4.1: Creating Docker Image for frontend") {
        //     steps {
        //         sh '''
        //         cd frontend
        //         ls
        //         docker build -t krp277/platemate-frontend:latest .
        //         '''
        //     }
        // }

        // stage("Stage 4.2: Scan Frontend Docker Image") {
        // steps {
        //     sh '''
        //     trivy image krp277/platemate-frontend:latest
        //     '''
        //     }
        // }

        // stage("Stage 4.3: Push Frontend Docker Image") {
        //     steps {
        //         sh '''
        //         docker login -u ${DOCKERHUB_CRED_USR} -p ${DOCKERHUB_CRED_PSW}
        //         docker push krp277/platemate-frontend:latest
        //         '''
        //     }
        // }

        // stage("Stage 5.1: Creating Docker Image for backend") {
        //     steps {
        //         sh '''
        //         cd backend
        //         docker build -t krp277/platemate-backend:latest .
        //         '''
        //     }
        // }

        // stage("Stage 5.2: Scan Backend Docker Image") {
        //     steps {
        //         sh '''
        //         trivy image krp277/platemate-backend:latest
        //         '''
        //     }
        // }


        // stage("Stage 5.3: Push Backend Docker Image") {
        //     steps {
        //         sh '''
        //         docker login -u ${DOCKERHUB_CRED_USR} -p ${DOCKERHUB_CRED_PSW}
        //         docker push krp277/platemate-backend:latest
        //         '''
        //     }
        // }

        stage("Stage 6: Ansible"){
            steps {
                sh '''
                echo "$VAULT_PASS" > /tmp/vault_pass.txt
                chmod 600 /tmp/vault_pass.txt
                ansible-playbook -i inventory-k8 --vault-password-file /tmp/vault_pass.txt playbook-k8.yaml
                rm -f /tmp/vault_pass.txt
                '''
            }

        }
    }
}