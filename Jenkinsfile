pipeline {

    agent {
        docker {
            image 'node:18-alpine'
            args '-u root:root -v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        // Variables de tu aplicación
        VITE_POKEAPI_URL = "https://pokeapi.co/api/v2"
        REGISTRY = "docker.io/mikemazun"
        IMAGE = "pokeapi-frontend"
        DOCKER_PASSWORD = credentials('dockerhub-credentials')

        // Credenciales
        RENDER_API_KEY   = credentials('render-api-key')

        // Service ID de Render
        RENDER_SERVICE_ID = "srv-d4oi4gre5dus73c94670"
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
                """
            }
        }

        stage('Push Docker image') {
            steps {
                sh """
                    docker login -u mikemazun -p '${DOCKER_PASSWORD}'
                    docker push ${REGISTRY}/${IMAGE}:${BUILD_NUMBER}
                """
            }
        }

        stage('Trigger Render Deploy') {
            steps {
                sh """
                    curl -X POST \\
                      -H "Authorization: Bearer ${RENDER_API_KEY}" \\
                      -H "Accept: application/json" \\
                      -H "Content-Type: application/json" \\
                      -d '{ "clearCache": false }' \\
                      https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys
                """
            }
        }
    }
}
