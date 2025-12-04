pipeline {
    agent any

    tools {
        nodejs 'node18'   // <-- Necesitas configurar Node en Jenkins (Global Tools)
    }

    environment {
        VITE_POKEAPI_URL = "https://pokeapi.co/api/v2"
        REGISTRY = "docker.io/mikemazun"
        IMAGE = "pokeapi-frontend"

        DOCKER_PASSWORD = credentials('dockerhub-credentials')
        RENDER_API_KEY  = credentials('render-api-key')
        RENDER_SERVICE_ID = "srv-d4oi4gre5dus73c94670"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Build (Node inside Docker)') {
            steps {
                sh """
                    docker run --rm \
                        -v \$(pwd):/app \
                        -w /app \
                        node:18-alpine \
                        sh -c "npm install && npm run build"
                """
            }
        }

        stage('Docker Build') {
            steps {
                sh """
                    echo $DOCKER_PASSWORD | docker login -u mikemazun --password-stdin
                    docker build -t ${REGISTRY}/${IMAGE}:${BUILD_NUMBER} .
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
