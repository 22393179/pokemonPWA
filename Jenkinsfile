pipeline {
    agent any

    environment {
        SONAR_HOST_URL = "http://sonarqube:9000"
        SONAR_PROJECT_KEY = "pokeapi-react"
        SONAR_TOKEN = credentials('sonarqube-token')

        VERCEL_TOKEN = credentials('vercel-token')
        ORG_ID = credentials('org-id')
        PROJECT_ID = credentials('project-id')
    }

    stages {

        stage('Check Branch') {
            steps {
                script {
                    // Detectar rama real
                    def branch = env.GIT_BRANCH?.replace('origin/', '') ?: sh(
                        script: "git rev-parse --abbrev-ref HEAD",
                        returnStdout: true
                    ).trim()

                    echo "Branch detectada: ${branch}"
                    env.BRANCH = branch
                }
            }
        }

        stage('Instalar dependencias') {
            when { expression { env.BRANCH == 'develop' || env.BRANCH == 'main' } }
            steps {
                sh 'npm install'
            }
        }

        stage('SonarQube Analysis') {
            when { expression { env.BRANCH == 'develop' || env.BRANCH == 'main' } }
            steps {
                withSonarQubeEnv('SonarServer') {
                    sh """
                        sonar-scanner \
                          -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                          -Dsonar.sources=. \
                          -Dsonar.host.url=${SONAR_HOST_URL} \
                          -Dsonar.login=${SONAR_TOKEN}
                    """
                }
            }
        }

        stage("Esperar Quality Gate") {
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
