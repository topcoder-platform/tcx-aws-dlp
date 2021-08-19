# Add Helm Repo
  helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
  # Install NGINX
  helm install nginx-ingress ingress-nginx/ingress-nginx \
    --namespace ingress-basic \
    --create-namespace \
    --set controller.replicaCount=2 \
    --set controller.nodeSelector."beta\.kubernetes\.io/os"=linux \
    --set defaultBackend.nodeSelector."beta\.kubernetes\.io/os"=linux \
    --set controller.admissionWebhooks.patch.nodeSelector."beta\.kubernetes\.io/os"=linux \
    --version="3.35.0" \
    --wait || true
