pipeline {
    agent any

    environment {
        DOCKERHUB = credentials('docker-hub-creds')
        IMAGE = "usmanfarooq317/argocd-gitops-car-app"
        TAG_FILE = ".image_tag"  // Stores last used numeric tag
    }

    stages {

        stage("Prepare Tag") {
            steps {
                script {
                    // Read the last tag from file, increment for new image
                    if (fileExists(TAG_FILE)) {
                        def lastTag = readFile(TAG_FILE).trim()
                        env.TAG = (lastTag.toInteger() + 1).toString()
                    } else {
                        env.TAG = "1"
                    }

                    // Save the new tag back to the file
                    writeFile file: TAG_FILE, text: env.TAG
                    echo "Building Docker image with tag: ${env.TAG}"
                }
            }
        }

        stage("Build Image") {
            steps {
                script {
                    // Build Docker image with new numeric tag
                    sh "docker build -t $IMAGE:${env.TAG} ."
                }
            }
        }

        stage("Push Image") {
            steps {
                script {
                    // Login to DockerHub and push the new image
                    sh """
                        echo $DOCKERHUB_PSW | docker login -u $DOCKERHUB_USR --password-stdin
                        docker push $IMAGE:${env.TAG}
                    """
                }
            }
        }

        stage("Cleanup Local Image") {
            steps {
                script {
                    // Optional: remove local copy to save space
                    sh "docker rmi $IMAGE:${env.TAG} || true"
                }
            }
        }
    }
}
