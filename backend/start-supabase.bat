@echo off
set RMT_DB_URL=jdbc:postgresql://aws-0-[YOUR-REGION].pooler.supabase.com:6543/postgres?sslmode=require
set RMT_DB_USERNAME=postgres.qgyrlshqwshvylbhjtbh
set RMT_DB_PASSWORD=Diabalo@666
set RMT_JWT_SECRET=nFyMIEEQVi95V6qKrqQNUvkDqq54BYaGeTgIP/Sq+fY=
cd /d C:\Users\Dell\Desktop\student3_k6_spike_stress\backend
C:\Users\Dell\Desktop\student3_k6_spike_stress\backend\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=supabase
