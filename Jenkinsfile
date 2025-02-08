node {
    checkout scm
    withEnv(["CI=true"]) {
        docker.image('node:16-buster-slim').inside('-p 3000:3000') {
            stage('Build') {
                try {
                    sh 'npm install'
                } catch (exception) {
                    echo 'Failed when installing packages (npm install)'
                    throw exception
                }
            }
            stage('Test') {
                try {
                    sh './jenkins/scripts/test.sh'
                    input message: 'Continue to deploy?'
                } catch (exception) {
                    echo 'Failed when running test scripts (test.sh)'
                    throw exception
                }
            }
            stage('Deliver') {
                sh './jenkins/scripts/deliver.sh'
                input message: 'Finished using the website? (Click "Proceed" to continue or wait 1 minute to automatically terminate the website)'
                sh './jenkins/scripts/kill.sh'
            }
        }
    }
}
