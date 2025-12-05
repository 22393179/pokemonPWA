pipeline {
    agent any

    environment {
        VERCEL_TOKEN = credentials('vercel-token')
        ORG_ID = credentials('org-id')
        PROJECT_ID = credentials('project-id')
        SONAR_TOKEN = credentials('sonar-token')
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
                    env.BRANCH_NAME = sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
                    echo "Branch detectada: ${env.BRANCH_NAME}"
                }
            }
        }

        stage('Install Dependencies') {
            when {
                expression { env.BRANCH_NAME == 'develop' }
            }
            steps {
                sh 'npm install'
            }
        }

        stage('SonarQube Analysis') {
            when {
                expression { env.BRANCH_NAME == 'develop' }
            }
            steps {
                withSonarQubeEnv('SonarServer') {
                    sh """
                    docker run --rm --network pokepwa_cicd \
                    -e SONAR_HOST_URL=http://sonarqube:9000 \
                    -e SONAR_LOGIN=${SONAR_TOKEN} \
                    -v ${pwd()}:/usr/src \
                    sonarsource/sonar-scanner-cli \
                    sonar-scanner \
                    -Dsonar.projectKey=pokeapi-react \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=http://sonarqube:9000 \
                    -Dsonar.login=${SONAR_TOKEN}
                    """
                }
            }
        }

        stage('Wait for Quality Gate') {
            when {
                expression { env.BRANCH_NAME == 'develop' }
            }
            steps {
                timeout(time: 3, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Deploy to Production') {
            when {
                expression { env.BRANCH_NAME == 'main' }
            }
            steps {
                sh """
                vercel --prod --token ${VERCEL_TOKEN} --confirm --org ${ORG_ID} --project ${PROJECT_ID}
                """
            }
        }
    }
}
