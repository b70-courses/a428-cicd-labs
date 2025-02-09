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
                } catch (exception) {
                    echo 'Failed when running test scripts (test.sh)'
                    throw exception
                }
            }
            stage('Manual Approval') {
                try {
                    input message: 'Continue to Deploy?'
                } catch (exception) {
                    echo 'Manual Aproval : Aborted'
                    throw exception
                }
            }
            stage('Deploy') {
                sh 'npm run build'
                sshPublisher(publishers: [
                    sshPublisherDesc(
                        configName: 'ec2-st-server-1', 
                        transfers: [
                            sshTransfer(
                                remoteDirectory: '/var/www/html/react-app', 
                                sourceFiles: 'build/',
                                removePrefix: 'build', 
                            )
                        ], 
                        usePromotionTimestamp: false, 
                        useWorkspaceInPromotion: false, 
                        verbose: true
                    )
                ])
                try {
                    timeout(time: 60, unit: 'SECONDS') {
                        input message: 'Finished checking? (Click "Proceed" to continue or wait 1 minute to automatically persist website, abort will terminate the website)'
                    }
                } catch (err) { 
                    echo 'Abort : Deployment aborted'
                    sshPublisher(publishers: [
                        sshPublisherDesc(
                            configName: 'ec2-st-server-1', 
                            transfers: [
                                sshTransfer(
                                    execCommand: 'rm -rf /var/www/html/react-app'
                                )
                            ], 
                            usePromotionTimestamp: false, 
                            useWorkspaceInPromotion: false, 
                            verbose: true
                        )
                    ])
                    echo 'Abort : Website terminated. Pipeline finished'
                    throw err
                }
                echo 'Website persisted. Pipeline finished'
            }
        }
    }
}
