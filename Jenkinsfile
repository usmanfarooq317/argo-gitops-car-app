pipeline {
    agent any

    environment {
        DOCKERHUB = credentials('docker-hub-creds')
        IMAGE = "usmanfarooq317/argocd-gitops-car-app"
        TAG = "latest"
    }

    stages {

        stage("DockerHub Login") {
            steps {
                sh '''
                echo "$DOCKERHUB_PSW" | docker login -u "$DOCKERHUB_USR" --password-stdin
                '''
            }
        }

        stage("Check & Remove Local Image (if exists)") {
            steps {
                sh '''
                if docker image inspect ${IMAGE}:${TAG} > /dev/null 2>&1; then
                    echo "Local image exists. Removing it..."
                    docker rmi -f ${IMAGE}:${TAG}
                else
                    echo "No local image found. Continuing..."
                fi
                '''
            }
        }

        stage("Build Image (latest)") {
            steps {
                sh '''
                echo "Building Docker image ${IMAGE}:${TAG}"
                docker build -t ${IMAGE}:${TAG} .
                '''
            }
        }

        stage("Push Image (overwrite latest)") {
            steps {
                sh '''
                echo "Pushing Docker image ${IMAGE}:${TAG}"
                docker push ${IMAGE}:${TAG}
                '''
            }
        }

        stage("Cleanup Local Image") {
            steps {
                sh '''
                docker rmi -f ${IMAGE}:${TAG} || true
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Image successfully built and pushed as :latest"
        }
        failure {
            echo "❌ Pipeline failed"
        }
    }
}
