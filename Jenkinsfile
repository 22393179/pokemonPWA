pipeline {
    agent any

    tools {
        nodejs 'node18'
    }

    environment {
        VITE_POKEAPI_URL   = "https://pokeapi.co/api/v2"
        REGISTRY           = "docker.io/mikemazun"
        IMAGE              = "pokeapi-frontend"

        RENDER_API_KEY     = credentials('render-api-key')
        RENDER_SERVICE_ID  = "srv-d4oi4gre5dus73c94670"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Build') {
            steps {
                sh "npm install"
                sh "npm run build"
            }
        }

        stage('Trigger Render Deploy') {
            steps {
                sh """
                    curl -X POST \
                        -H "Authorization: Bearer ${RENDER_API_KEY}" \
                        -H "Accept: application/json" \
                        -H "Content-Type: application/json" \
                        -d '{ "clearCache": false }' \
                        https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys
                """
            }
        }
    }
}
