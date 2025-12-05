pipeline {
    agent any
    environment {
        ORG_ID = credentials('org-id')
        PROJECT_ID = credentials('project-id')
        VERCEL_TOKEN = credentials('vercel-token')
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
                    BRANCH_NAME = sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
                    echo "Branch detectada: ${BRANCH_NAME}"
                }
            }
        }
        stage('Install Dependencies') {
            when {
                expression { BRANCH_NAME == 'develop' || BRANCH_NAME == 'main' }
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
                    sh "sonar-scanner -Dsonar.projectKey=pokeapi-react -Dsonar.sources=. -Dsonar.host.url=http://sonarqube:9000 -Dsonar.login=${SONAR_TOKEN}"
                }
            }
        }
        stage('Wait for Quality Gate') {
            when {
                expression { BRANCH_NAME == 'develop' }
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
                sh """
                    vercel --token=${VERCEL_TOKEN} --prod --confirm
                """
            }
        }
    }
    post {
        success {
            echo 'Pipeline completado exitosamente.'
        }
        failure {
            echo 'Pipeline falló.'
        }
    }
}
