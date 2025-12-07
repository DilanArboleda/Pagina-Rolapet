# Página rola pet 

Para iniciar la página rolapet se debe ejecutar el siguiente comando: 

```bash
npm run dev
```

Para desplegarlo con docker: 

```bash
docker build -t rolapet-front .
docker run -p 3000:3000 -v ${PWD}:/app -v /app/node_modules rolapet-front
```