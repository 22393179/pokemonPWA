pipeline {
    agent any

    environment {
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
                    BRANCH = env.GIT_BRANCH ?: env.BRANCH_NAME
                    echo "Branch detectada: ${BRANCH}"
                }
            }
        }

        stage('Instalar dependencias') {
            when { expression { BRANCH == 'develop' || BRANCH == 'main' } }
            steps {
                sh 'npm install'
            }
        }

        stage('SonarQube Analysis') {
            when { expression { BRANCH == 'develop' || BRANCH == 'main' } }
            steps {
                withSonarQubeEnv('SonarServer') {
                    sh """
                        docker run --rm \
                        -e SONAR_HOST_URL=\$SONAR_HOST_URL \
                        -e SONAR_LOGIN=${SONAR_TOKEN} \
                        -v ${WORKSPACE}:/usr/src \
                        sonarsource/sonar-scanner-cli \
                        sonar-scanner \
                          -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                          -Dsonar.sources=src \
                          -Dsonar.host.url=\$SONAR_HOST_URL \
                          -Dsonar.login=${SONAR_TOKEN}
                    """
                }
            }
        }

        stage("Esperar Quality Gate") {
            when { expression { BRANCH == 'develop' || BRANCH == 'main' } }
            steps {
                timeout(time: 3, unit: 'MINUTES') {
                    script {
                        def qg = waitForQualityGate()
                        if (qg.status != 'OK') {
                            error "Quality Gate falló: ${qg.status}"
                        }
                    }
                }
            }
        }

        stage('Deploy a Producción (solo main)') {
            when { expression { BRANCH == 'main' } }
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
