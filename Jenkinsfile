pipeline {
    agent any

    environment {
        ORG_ID = credentials('org-id')
        PROJECT_ID = credentials('project-id')
        VERCEL_TOKEN = credentials('vercel-token')
        SONAR_TOKEN = credentials('sonarqube-token')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                script {
                    BRANCH_NAME = sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()
                    echo "Branch detectada: ${BRANCH_NAME}"
                }
            }
        }

        stage('Install Dependencies') {
            when {
                expression { BRANCH_NAME == 'develop' }
            }
            steps {
                sh 'npm install'
            }
        }

        stage('SonarQube Analysis') {
            when {
                expression { BRANCH_NAME == 'develop' }
            }
            steps {
                withSonarQubeEnv('SonarServer') {
                    sh """
                        docker run --rm --network pokepwa_cicd \\
                        -e SONAR_HOST_URL=http://sonarqube:9000 \\
                        -e SONAR_LOGIN=${SONAR_TOKEN} \\
                        -v ${env.WORKSPACE}:/usr/src sonarsource/sonar-scanner-cli \\
                        sonar-scanner -Dsonar.projectKey=pokeapi-react -Dsonar.sources=. -Dsonar.host.url=http://sonarqube:9000 -Dsonar.login=${SONAR_TOKEN}
                    """
                }
            }
        }

        stage('Wait for Quality Gate') {
            when {
                expression { BRANCH_NAME == 'develop' }
            }
            steps {
                timeout(time: 3, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                echo "Deploy a producción usando Vercel..."
                sh """
                    npx vercel --prod --token=${VERCEL_TOKEN} --confirm
                """
            }
        }
    }
}
