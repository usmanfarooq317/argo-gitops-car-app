pipeline {
  agent any

  environment {
    DOCKERHUB = credentials('docker-hub-creds')
    IMAGE = "usmanfarooq317/argocd-gitops-car-app"
  }

  stages {

    stage("Build") {
      steps {
        sh "docker build -t $IMAGE:latest ."
      }
    }

    stage("Push") {
      steps {
        sh """
          echo $DOCKERHUB_PSW | docker login -u $DOCKERHUB_USR --password-stdin
          docker push $IMAGE:latest
        """
      }
    }
  }
}
