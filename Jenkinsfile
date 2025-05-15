pipeline {
    agent any

    environment {
        REPO = 'jake1331982/jenkins'
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
                        sh 'npm run build'
                    }
                }
            }
        }
        stage('Ejecutar Pruebas') {
            steps {
                script {
                    dir(REPO) {
                        sh 'npm test'
                    }
                }
            }
        }
        stage('Construir Imagen Docker') {
            steps {
                dir('app') {
                    script {
                        dockerImage = docker.build("${IMAGE_NAME}")
                    }
                }
            }
        }
        stage('Login en ECR') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
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
                    dockerImage.tag("${ECR_REPO}", "latest")
                    sh "docker push ${ECR_REPO}:latest"
                }
            }
        }
    }    
    
}
