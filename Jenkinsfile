pipeline {
    agent any

    environment {
        DOCKERHUB = credentials('docker-hub-creds')
        IMAGE = "usmanfarooq317/argocd-gitops-car-app"
    }

    stages {
        stage("Build") {
            steps {
                script {
                    // Try to pull existing image (checks if it exists)
                    def exists = sh(script: "docker pull $IMAGE:latest || echo 'notfound'", returnStdout: true).trim()

                    if (!exists.contains("notfound")) {
                        echo "Image exists on DockerHub, removing local copy to replace..."
                        sh "docker rmi $IMAGE:latest || true"
                    } else {
                        echo "Image does not exist on DockerHub, will push new build"
                    }

                    // Build new image
                    sh "docker build -t $IMAGE:latest ."
                }
            }
        }

        stage("Push") {
            steps {
                script {
                    // Login to DockerHub
                    sh """
                        echo $DOCKERHUB_PSW | docker login -u $DOCKERHUB_USR --password-stdin
                        docker push $IMAGE:latest
                    """
                }
            }
        }
    }
}
