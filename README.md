
# 🚗 ArgoCD GitOps Car App

A professional GitOps project demonstrating **dynamic scaling of a Kubernetes app** using **ArgoCD, Jenkins, Docker, and HPA**. The frontend displays a **road with cars**, where the **number of cars equals the number of replicas**. The app automatically scales based on CPU usage via Horizontal Pod Autoscaler (HPA).

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Flow](#architecture--flow)
3. [Repository Structure](#repository-structure)
4. [Prerequisites](#prerequisites)
5. [Namespaces](#namespaces)
6. [Deployment Steps](#deployment-steps)
7. [Jenkins CI/CD Pipeline](#jenkins-cicd-pipeline)
8. [Horizontal Pod Autoscaler (HPA)](#horizontal-pod-autoscaler-hpa)
9. [Testing & Scaling](#testing--scaling)
10. [Useful Commands](#useful-commands)

---

## 1️⃣ Project Overview

This project demonstrates:

* **GitOps workflow** using ArgoCD.
* **Continuous deployment** using Jenkins and DockerHub.
* **Dynamic scaling** of replicas via HPA.
* A **frontend visualization** where each replica shows a car moving on a road.
* Auto-scaling demonstration by generating CPU load.

---

## 2️⃣ Architecture & Flow

**Flow:**

```
[Developer] 
     ↓ push code to GitHub
[Jenkins] 
     ↓ Builds Docker image → Pushes to DockerHub
[ArgoCD] 
     ↓ Monitors Git repo → Deploys app to Kubernetes
[Kubernetes Deployment] 
     ↓ Pods run app
[HPA] 
     ↓ Monitors CPU → Scales replicas dynamically
[Frontend] 
     ↓ Displays cars = # of replicas
```

* Jenkins triggers on repo changes → builds Docker image → pushes to DockerHub.
* ArgoCD syncs manifests → deploys app in Kubernetes namespace.
* HPA monitors CPU usage → scales deployment → more cars appear on frontend.

---

## 3️⃣ Repository Structure

```
argo-gitops-car-app/
│
├── app/                        # Python FastAPI backend
│   ├── main.py
│   ├──static/
│       ├── app.js
│       ├── style.css
│
├── k8s/                         # Kubernetes manifests
│   ├── deployment.yaml          # Deployment config (replicas, CPU, container)
│   ├── service.yaml             # Service to expose the app
│   ├── hpa.yaml                 # Horizontal Pod Autoscaler
│   └── argocd-app.yaml          # ArgoCD Application CRD
│   └── namespace.yaml
│
├── Dockerfile                   # Defines how backend container is built
├── Jenkinsfile                  # CI/CD pipeline configuration
├── requirements.txt
└── README.md
```

---

## 4️⃣ Prerequisites

* Kubernetes cluster (Minikube, kind, or cloud)
* ArgoCD installed (`argocd` namespace)
* Jenkins server with Docker installed
* DockerHub account (for private image registry)
* Metrics server installed for HPA:

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

* `hey` tool (for load testing)

---

## 5️⃣ Namespaces

| Namespace                      | Purpose                                     |
| ------------------------------ | ------------------------------------------- |
| `argocd`                       | ArgoCD system                               |
| `argo-gitops-car-app`          | App deployment & resources                  |
| `gitops` (optional)            | Could be used for testing other GitOps apps |
| `default`, `kube-system`, etc. | Standard Kubernetes namespaces              |

**Important:**

* **ArgoCD Applications must be deployed in `argocd` namespace**
* App resources (Deployment, Service, HPA) are in `argo-gitops-car-app`

---

## 6️⃣ Deployment Steps

### a) Create app namespace

```bash
kubectl create namespace argo-gitops-car-app
```

### b) Create DockerHub secret (if using private image)

```bash
kubectl create secret docker-registry dockerhub-secret \
  --docker-username=YOUR_DOCKER_USER \
  --docker-password=YOUR_DOCKER_PASS \
  --docker-email=YOUR_EMAIL \
  -n argo-gitops-car-app
```

### c) Apply Kubernetes manifests

* Deploy **Deployment, Service, and HPA** in the `argo-gitops-car-app` namespace:

```bash
kubectl apply -f k8s/ -n argo-gitops-car-app
```

### d) Apply ArgoCD Application

* The ArgoCD Application CRD **must be applied in the `argocd` namespace**:

```bash
kubectl apply -f k8s/argocd-app.yaml -n argo-gitops-car-app
```

### e) Sync via CLI / UI

```bash
argocd app sync gitops-traffic
argocd app get gitops-traffic
```

* Status should become: `Synced / Healthy`
* Deployment will create initial 2 replicas → 2 cars appear

---

## 7️⃣ Jenkins CI/CD Pipeline

* Jenkins monitors the GitHub repository.
* On code changes, Jenkins **builds a new Docker image** and pushes it to DockerHub.
* ArgoCD detects the updated manifests and **deploys the new image automatically**, keeping the app **self-healing**.
* The pipeline ensures the latest code is always deployed and visible in the frontend.

---

## 8️⃣ Horizontal Pod Autoscaler (HPA)

* HPA dynamically scales pods based on CPU utilization.
* Min replicas = 2 → 2 cars
* Max replicas = 5 → 5 cars
* Each pod = 1 car on the frontend
* HPA monitors CPU requests/limits defined in the Deployment and adjusts replicas automatically.

---

## 9️⃣ Testing & Scaling

### a) Check current pods and HPA

```bash
kubectl get pods -n argo-gitops-car-app
kubectl get hpa -n argo-gitops-car-app
```

### b) Generate load to trigger scaling

```bash
hey -z 3m -q 50 -c 10 http://192.168.49.2:30944/
```

* HPA detects CPU increase → scales replicas → more cars appear

### c) Watch pods and HPA metrics

```bash
kubectl get pods -n argo-gitops-car-app -w
kubectl get hpa gitops-hpa -n argo-gitops-car-app -w
```

### d) Reset replicas after demo

```bash
kubectl scale deploy gitops-app --replicas=2 -n argo-gitops-car-app
```

---

## 10️⃣ Useful Commands

### Namespaces & pods

```bash
kubectl get ns
kubectl get pods -n argo-gitops-car-app
kubectl get svc -n argo-gitops-car-app
kubectl get hpa -n argo-gitops-car-app
```

### ArgoCD

```bash
kubectl get applications -n argocd
kubectl describe application gitops-traffic -n argocd
argocd app sync gitops-traffic
argocd app get gitops-traffic
```

### Stress test / HPA scaling

```bash
hey -z 3m -q 50 -c 10 http://<MINIKUBE_IP>:<NODE_PORT>/
kubectl get pods -n argo-gitops-car-app -w
kubectl get hpa gitops-hpa -n argo-gitops-car-app -w
kubectl scale deploy gitops-app --replicas=2 -n argo-gitops-car-app
```

---

## ✅ Key Takeaways

1. **GitOps workflow**: Jenkins → Docker → ArgoCD → Kubernetes
2. **Dynamic scaling**: HPA adjusts replicas based on CPU usage
3. **Frontend reflects pods**: Each replica = 1 car on the road
4. **Namespaces**: ArgoCD CRDs in `argocd`, app resources in `argo-gitops-car-app`
5. **Secrets**: DockerHub credentials required if private image

---
