pipeline {
    agent any

    environment {
        // Variables de tu build
        VITE_POKEAPI_URL = "https://pokeapi.co/api/v2"
        REGISTRY = "docker.io/mikemazun"
        IMAGE = "pokeapi-frontend"

        // Credencial que guardaste en Jenkins (Render API Key)
        RENDER_API_KEY   = credentials('render-api-key')

        // Reemplaza esto con TU service ID desde Render
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
                    docker push ${REGISTRY}/${IMAGE}:${BUILD_NUMBER}
                """
            }
        }

        // 🔥🔥🔥 ESTA ES LA PARTE NUEVA PARA RENDER 🔥🔥🔥
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
        // 🔥🔥🔥 FIN DE LA PARTE NUEVA 🔥🔥🔥
    }
}
