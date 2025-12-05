pipeline {
    agent any

    environment {
        SONAR_HOST_URL = 'http://sonarqube:9000'
    }

    stages {

        stage('Check Branch') {
            steps {
                script {
                    BRANCH = env.BRANCH_NAME
                    echo "Branch detectada: ${BRANCH}"
                }
            }
        }

        stage('Instalar dependencias') {
            when { expression { BRANCH == "develop" } }
            steps {
                sh 'npm install'
            }
        }

        stage('SonarQube Analysis') {
            when { expression { BRANCH == "develop" } }
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh """
                        docker run --rm \
                          --network pokepwa_cicd \
                          -e SONAR_HOST_URL=$SONAR_HOST_URL \
                          -e SONAR_LOGIN=$SONAR_TOKEN \
                          -v $WORKSPACE:/usr/src \
                          sonarsource/sonar-scanner-cli sonar-scanner \
                            -Dsonar.projectKey=pokeapi-react \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=$SONAR_HOST_URL \
                            -Dsonar.login=$SONAR_TOKEN \
                            -Dsonar.projectBaseDir=/usr/src \
                            -Dsonar.working.directory=/usr/src/.scannerwork \
                            -Dsonar.scanner.metadataFilePath=/usr/src/report-task.txt
                    """
                }
            }
        }

        stage('Esperar Quality Gate') {
            when { expression { BRANCH == "develop" } }
            steps {
                timeout(time: 3, unit: 'MINUTES') {
                    script {
                        waitForQualityGate abortPipeline: true
                    }
                }
            }
        }

        stage('Deploy a Producción (solo main)') {
            when { expression { BRANCH == "main" } }
            steps {
                withCredentials([
                    string(credentialsId: 'vercel-token', variable: 'VERCEL_TOKEN'),
                    string(credentialsId: 'org-id', variable: 'ORG_ID'),
                    string(credentialsId: 'project-id', variable: 'PROJECT_ID')
                ]) {
                    sh """
                        npx vercel deploy --prod \
                          --token \$VERCEL_TOKEN \
                          --yes \
                          --confirm \
                          --scope \$ORG_ID \
                          --project \$PROJECT_ID
                    """
                }
            }
        }
    }
}
