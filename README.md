# Dozn-Angular Plugin

For full information and instructions, please refer to https://dozn.io.  However, since you are already here we'll give you a quick glance at what this plugin (and dozn) does!

## At a Glance

Dozn is a tool for automatically generating E2E Tests and visualizing your application.  Ever spend hours setiting up css selectors, only to have features change and E2E Tests become obsolete in your project? 

You're not the only one!

Dozn aims to change the way we utilize and think about E2E Testing.  Since (currently) many developers can't find the time to maintain their E2E Test Suite, we decided to change the way we think about E2E Tests.

## What this plugin captures

We do NOT capture your source code (check for yourself! #loveopensource). However, we do capture what's already public to end-users... the DOM!   The only exception to this is that we have you bootstrap your app so we can capture your Angular Controller names (i.e., "PageCtrl") as a string, as well as the version of your app.

This allows us to present your tests to you in a way you'll understand, instead of random guesses at what a page is called.   If you have a "LoginCtrl", then the buttons on the login page will be listed under "LoginCtrl" page.

## Instructions

* Sign up for an account at https://dozn.io to get your API Key
* In your app, 
  * ```npm install @webjunto/dozn-angular --save-dev```
* In your app.module.ts, 
  * ```import { DoznModule } from '@webjunto/dozn-angular';```
* Under "Imports", declare Dozn Module with your API Key 
  * ```DoznModule.forRoot({apiKey: 'MYAPIKEY'})```
* Add in your root page
  * ```<app-dozn></app-dozn>```
* Build/Run your app, and watch the your app populate on Dozn!

## Steps to publish

* First build the plugin:
  * `npm run build`

* Once its builded move to dist folder:
  * `cd dist`

* And then publish it to NPM:
  * `npm publish`

## Disclaimers

Read our Privacy Policy and Terms of service on https://dozn.io and you'll find that it's a very user protective policy!

**IMPORTANT**:  Remember, Dozn is for DEVELOPMENT BUILDS ONLY.  Dozn captures your tester data for testing purposes. Do NOT under any circumstances use Dozn for production builds.
