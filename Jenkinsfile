pipeline {
    agent any

    environment {
        // Credenciales correctas de Jenkins
        SONAR_TOKEN   = credentials('sonarqube-token')
        VERCEL_TOKEN  = credentials('vercel-token')
        ORG_ID        = credentials('org-id')
        PROJECT_ID    = credentials('project-id')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Detect Branch') {
            steps {
                script {
                    BRANCH_NAME = sh(
                        script: 'git rev-parse --abbrev-ref HEAD',
                        returnStdout: true
                    ).trim()
                    echo "Branch detectada: ${BRANCH_NAME}"
                }
            }
        }

        stage('Install Dependencies') {
            when {
                expression { BRANCH_NAME != 'main' } // Si quieres saltarlo en main, ajusta aquí
            }
            steps {
                sh 'npm install'
            }
        }

        stage('SonarQube Analysis') {
            when {
                expression { BRANCH_NAME != 'main' } // Ajusta según tu flujo
            }
            steps {
                withSonarQubeEnv('SonarServer') {
                    sh """
                    docker run --rm --network pokepwa_cicd \
                        -e SONAR_HOST_URL=${env.SONAR_HOST_URL} \
                        -e SONAR_LOGIN=${SONAR_TOKEN} \
                        -v \$(pwd):/usr/src \
                        sonarsource/sonar-scanner-cli \
                        sonar-scanner \
                        -Dsonar.projectKey=pokeapi-react \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=${env.SONAR_HOST_URL} \
                        -Dsonar.login=${SONAR_TOKEN}
                    """
                }
            }
        }

        stage('Quality Gate') {
            when {
                expression { BRANCH_NAME != 'main' }
            }
            steps {
                timeout(time: 3, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                echo "Deploying to Production..."
                // Aquí tu deploy a Vercel o servidor
            }
        }
    }
}
