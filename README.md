#### app-financial-calculator

Repo for React Financial Calculator


#### Development

###### Start Express Server that renders multiple components on the page:

*Components:* Configurator, Calculator, ReducerRegistry

    `npm run dev`


###### Start Webpack Dev Server with Standalone calculator on page

*Components:* Calculator, ReducerRegistry

    `npm start`    

#### Code Quality
Lint JS
`npm run lint:js`
Lint Sass
`npm run lint:sass`

##### Unit Tests (Using Jest)
Run Tests
`npm test`

Debug Tests (using Chrome)
`node --inspect-brk node_modules/.bin/jest --runInBand`

Coverage
`npm run coverage` -- gets put in coverage directory (.gitignore, not to be checked in)

#### Contributors
* Frank Young
* Rajesh Cherukuri