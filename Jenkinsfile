pipeline {
    agent any

    environment {
        DOCKERHUB = credentials('docker-hub-creds')  // username & token
        IMAGE = "usmanfarooq317/argocd-gitops-car-app"
        TAG_FILE = ".image_tag"
    }

    stages {

        stage("Prepare Tag") {
            steps {
                script {
                    if (fileExists(TAG_FILE)) {
                        def lastTag = readFile(TAG_FILE).trim()
                        env.TAG = (lastTag.toInteger() + 1).toString()
                    } else {
                        env.TAG = "1"
                    }
                    writeFile file: TAG_FILE, text: env.TAG
                    echo "Using Docker image tag: ${env.TAG}"
                }
            }
        }

        stage("Ensure DockerHub Repo Exists") {
            steps {
                script {
                    echo "Checking if repository exists on DockerHub..."
                    def repoCheck = sh(
                        script: """curl -s -u $DOCKERHUB_USR:$DOCKERHUB_PSW https://hub.docker.com/v2/repositories/$DOCKERHUB_USR/$(basename $IMAGE)/""",
                        returnStatus: true
                    )

                    if (repoCheck != 0) {
                        echo "Repository does not exist, creating..."
                        sh """
                            curl -s -u $DOCKERHUB_USR:$DOCKERHUB_PSW -X POST \
                            -H "Content-Type: application/json" \
                            -d '{ "name": "$(basename $IMAGE)", "is_private": false }' \
                            https://hub.docker.com/v2/repositories/$DOCKERHUB_USR/
                        """
                        echo "Repository created successfully."
                    } else {
                        echo "Repository already exists."
                    }
                }
            }
        }

        stage("Build Image") {
            steps {
                script {
                    sh "docker build -t $IMAGE:${env.TAG} ."
                }
            }
        }

        stage("Push Image") {
            steps {
                script {
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
                    sh "docker rmi $IMAGE:${env.TAG} || true"
                }
            }
        }
    }
}
