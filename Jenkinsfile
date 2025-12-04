pipeline {
    agent any

    environment {
        REGISTRY = "mikemazun/poke-landing"
        IMAGE_TAG = "v${env.BUILD_NUMBER}"
        DOCKERHUB = credentials('dockerhub-cred')   // credenciales en Jenkins
        KUBECONFIG = credentials('kubeconfig-cred') // kubeconfig guardado en Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/TU-REPO/poke-landing.git'
            }
        }

        stage('Build React') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t $REGISTRY:$IMAGE_TAG ."
            }
        }

        stage('Push Docker Image') {
            steps {
                sh "echo $DOCKERHUB_PSW | docker login -u $DOCKERHUB_USR --password-stdin"
                sh "docker push $REGISTRY:$IMAGE_TAG"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh "kubectl set image deployment/poke-landing poke-landing=$REGISTRY:$IMAGE_TAG"
                sh "kubectl rollout status deployment/poke-landing"
            }
        }
    }
}
