pipeline {
    agent any

    environment {
        SONAR_HOST_URL = "http://sonarqube:9000"
        SONAR_PROJECT_KEY = "pokeapi-react"

        VERCEL_TOKEN = credentials('vercel-token')
        ORG_ID = credentials('org-id')
        PROJECT_ID = credentials('project-id')
    }

    stages {

        stage('Check Branch') {
            steps {
                script {
                    env.BRANCH = sh(returnStdout: true, script: "git rev-parse --abbrev-ref HEAD").trim()
                    echo "Branch detectada: ${env.BRANCH}"
                }
            }
        }

        stage('Instalar dependencias') {
            steps {
                sh 'npm install'
            }
        }

        stage('SonarQube Analysis') {
            when { expression { env.BRANCH == 'develop' || env.BRANCH == 'main' } }
            steps {
                withCredentials([
                    string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')
                ]) {
                    withSonarQubeEnv('SonarServer') {
                        sh """
                            docker run --rm \
                              --network pokepwa_cicd \
                              -e SONAR_HOST_URL=${SONAR_HOST_URL} \
                              -e SONAR_LOGIN=${SONAR_TOKEN} \
                              -v ${WORKSPACE}:/usr/src \
                              sonarsource/sonar-scanner-cli \
                              sonar-scanner \
                                -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                                -Dsonar.sources=. \
                                -Dsonar.host.url=${SONAR_HOST_URL} \
                                -Dsonar.login=${SONAR_TOKEN} \
                                -Dsonar.working.directory=/opt/sonar
                        """
                    }
                }
            }
        }

        stage('Esperar Quality Gate') {
            when { expression { env.BRANCH == 'develop' || env.BRANCH == 'main' } }
            steps {
                timeout(time: 3, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Deploy a Producción (solo main)') {
            when { expression { env.BRANCH == 'main' } }
            steps {
                sh """
                    vercel deploy --prod \
                        --token=${VERCEL_TOKEN} \
                        --yes \
                        --org ${ORG_ID} \
                        --project ${PROJECT_ID}
                """
            }
        }

    }
}
