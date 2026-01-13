pipeline {
    agent any

    environment {
        DOCKERHUB = credentials('docker-hub-creds')  // DockerHub username & token
        IMAGE = "usmanfarooq317/argocd-gitops-car-app"
        TAG_FILE = ".image_tag"
    }

    stages {

        stage("Prepare Tag") {
            steps {
                script {
                    // Read last tag from file, or start at 1
                    if (fileExists(TAG_FILE)) {
                        def lastTag = readFile(TAG_FILE).trim()
                        env.TAG = (lastTag.toInteger() + 1).toString()
                    } else {
                        env.TAG = "1"
                    }
                    writeFile file: TAG_FILE, text: env.TAG
                    echo "Using image tag: ${env.TAG}"
                }
            }
        }

        stage("Ensure DockerHub Repository Exists") {
            steps {
                script {
                    sh '''
                    # Extract repo name from full image name
                    REPO_NAME="${IMAGE##*/}"

                    # Check if repository exists on DockerHub
                    REPO_CHECK=$(curl -s -u $DOCKERHUB_USR:$DOCKERHUB_PSW https://hub.docker.com/v2/repositories/$DOCKERHUB_USR/$REPO_NAME/)

                    if echo "$REPO_CHECK" | grep -q '"detail": "Not Found"'; then
                        echo "Repository does not exist. Creating it..."
                        curl -s -u $DOCKERHUB_USR:$DOCKERHUB_PSW \
                            -X POST https://hub.docker.com/v2/repositories/ \
                            -H "Content-Type: application/json" \
                            -d "{\"name\":\"$REPO_NAME\",\"is_private\":false}"
                        echo "Repository created successfully!"
                    else
                        echo "Repository already exists, continuing..."
                    fi
                    '''
                }
            }
        }

        stage("Build Image") {
            steps {
                script {
                    echo "Building Docker image: ${IMAGE}:${TAG}"
                    sh "docker build -t ${IMAGE}:${TAG} ."
                }
            }
        }

        stage("Push Image") {
            steps {
                script {
                    echo "Pushing Docker image: ${IMAGE}:${TAG}"
                    sh '''
                    echo $DOCKERHUB_PSW | docker login -u $DOCKERHUB_USR --password-stdin
                    docker push ${IMAGE}:${TAG}
                    '''
                }
            }
        }

        stage("Cleanup Local Image") {
            steps {
                script {
                    sh "docker rmi ${IMAGE}:${TAG} || true"
                }
            }
        }
    }
}
