{{/* vim: set filetype=mustache */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "presidio.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "presidio.fullname" -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "presidio.analyzer.fullname" -}}
{{ include "presidio.fullname" . | printf "%s-analyzer" }}
{{- end -}}
{{- define "presidio.anonymizer.fullname" -}}
{{ include "presidio.fullname" . | printf "%s-anonymizer" }}
{{- end -}}
{{- define "presidio.anonymizerimage.fullname" -}}
{{ include "presidio.fullname" . | printf "%s-image-redactor" }}
{{- end -}}
{{- define "presidio.ingress.fullname" -}}
{{ include "presidio.fullname" . | printf "%s-ingress" }}
{{- end -}}
{{- define "presidio.ingress.cert.secretname" -}}
{{ include "presidio.fullname" . | printf "%s-ingress-cert" }}
{{- end -}}

{{- define "presidio.analyzer.address" -}}
{{template "presidio.analyzer.fullname" .}}:{{.Values.analyzer.service.externalPort}}
{{- end -}}

{{- define "presidio.anonymizer.address" -}}
{{template "presidio.anonymizer.fullname" .}}:{{.Values.anonymizer.service.externalPort}}
{{- end -}}

{{- define "presidio.anonymizerimage.address" -}}
{{template "presidio.anonymizerimage.fullname" .}}:{{.Values.anonymizerimage.service.externalPort}}
{{- end -}}

{{- define "presidio.rbac.version" }}rbac.authorization.k8s.io/v1{{ end -}}

{{/* Generate certificates for custom-metrics api server */}}
{{- define "tcx-presidio.gen-certs" -}}
{{- $ca := genCA (.Values.caCommonName) 365 -}}
{{- $altNames := list (.Values.certDomainName) -}}
{{- $cert := genSignedCert (.Values.certDomainName) nil $altNames 365 $ca -}}
tls.crt: {{ $cert.Cert | b64enc }}
tls.key: {{ $cert.Key | b64enc }}
{{- end -}}
