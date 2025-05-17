pipeline {
    agent any

    environment {
        REPO = 'jenkins'
        IMAGE_NAME = 'jenkins'
        AWS_REGION = 'us-east-1'
        ECR_REGISTRY = '025066267125.dkr.ecr.us-east-1.amazonaws.com'
        ECR_REPO = "${ECR_REGISTRY}/${IMAGE_NAME}"
    }

    stages {

        stage('Clean Workspace') {
            steps {
                script {
                    sh 'rm -rf *'
                }
            }
        }

        stage('Clonar desde GitHub con Token') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'GITHUB_CREDENTIALS', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                        sh '''
                          git clone https://${GIT_USER}:${GIT_TOKEN}@github.com/jake1331982/jenkins.git
                        '''
                    }
                }
            }
        }

        stage('Instalar Dependencias') {
            steps {
                script {
                    dir(REPO) {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Construir Imagen Docker') {
            steps {
                dir(REPO) {
                    script {
                        dockerImage = docker.build("${IMAGE_NAME}:latest")
                    }
                }
            }
        }

        stage('Login en ECR') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws_credentials']]) {
                    script {
                        sh """
                            aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
                        """
                    }
                }
            }
        }

        stage('Push a ECR') {
            steps {
                script {
                    // Use docker tag in shell to tag the image
                    sh "docker tag ${IMAGE_NAME}:latest ${ECR_REPO}:latest"
                    // Push the image to ECR
                    sh "docker push ${ECR_REPO}:latest"
                }
            }
        }
    }
}
