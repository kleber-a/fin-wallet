// import type { Config } from 'jest'
// import nextJest from 'next/jest.js'
 
// const createJestConfig = nextJest({
//   // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
//   dir: './',
// })
 
// // Add any custom config to be passed to Jest
// const config: Config = {
//   coverageProvider: 'v8',
//   testEnvironment: 'jsdom',
//   // Add more setup options before each test is run
//   // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
// }
 
// // createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
// export default createJestConfig(config)


import type { Config } from 'jest'
import nextJest from 'next/jest.js'
import path from 'path'; 
 
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})
 
// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["html", "text"],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // ou jest.setup.js
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
    // Mapeia o alias '@/' para o diretório 'src'
    // A regex '^@/(.*)$' captura qualquer coisa após '@/' e a substitui por 'src/$1'
    '^@/(.*)$': path.resolve(__dirname, './src/$1'),
  },
}
 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)