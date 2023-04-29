/* eslint-disable prettier/prettier */
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ExpressAdapter } from "@nestjs/platform-express";
// import * as express  from 'express';

// // import { async } from 'rxjs';

// const server = express()

// export const createnestserver = async (instance) => {
//     const app = await NestFactory.create(
//         AppModule,
//         new ExpressAdapter(instance),
//     );
//   const globalPrefix = '.netlify/functions/main';
//   app.setGlobalPrefix(globalPrefix);
//   app.enableCors();
//   return app.init();
// };

// createnestserver(server).then( v => console.log('Nest Ready')).catch(e => console.log('Nest broke',e))


// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import serverlessExpress from '@vendia/serverless-express'
// import { Handler,Context, Callback } from 'aws-lambda';
// let  server : Handler
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.enableCors();
//   await app.init();
//   const expressapp = app.getHttpAdapter().getInstance();
//   return serverlessExpress({app: expressapp});
// }

// export const handler : Handler = async (
// event :any,
// context :Context,
// callback: Callback,
// ) => {
//      server = server ?? (await bootstrap()) 
// return server(event,context,callback)
// }