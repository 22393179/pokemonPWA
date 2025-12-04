pipeline {
    agent any

    environment {
        // Variable de entorno para Vite
        VITE_POKEAPI_URL = "https://pokeapi.co/api/v2"  
        // Cambia por tus credenciales o almacénalas en Jenkins Credentials
        REGISTRY = "docker.io/mikemazun"
        IMAGE = "pokeapi-frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Vite') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build Docker image') {
            steps {
                sh """
                    docker build -t ${REGISTRY}/${IMAGE}:${BUILD_NUMBER} .
                    docker push ${REGISTRY}/${IMAGE}:${BUILD_NUMBER}
                """
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh """
                    kubectl set image deployment/pokeapi-frontend \
                    pokeapi-frontend=${REGISTRY}/${IMAGE}:${BUILD_NUMBER}

                    kubectl rollout restart deployment/pokeapi-frontend
                """
            }
        }
    }
}
