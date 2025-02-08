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
                    // input message: 'Continue to deploy?'
                } catch (exception) {
                    echo 'Failed when running test scripts (test.sh)'
                    throw exception
                }
            }
            stage('Deliver') {
                sh './jenkins/scripts/deliver.sh'
                // try {
                //     timeout(time: 60, unit: 'SECONDS') {
                //         input message: 'Finished using the website? (Click "Proceed" to continue or wait 1 minute to automatically terminate the website)'
                //     }
                // } catch (err) { 
                //     // do nothing instead of aborting so it continues to the next step 
                //     echo 'Timeout reached, proceed to terminate the website...'
                // }
                // // kill the process if user accepts
                sh './jenkins/scripts/kill.sh'

                // delivers the website into EC2 instance via SSH
                sshPublisher(publishers: [
                    sshPublisherDesc(
                        configName: 'aws ec2 test environment', 
                        transfers: [
                            sshTransfer(
                                // cleanRemote: false, 
                                // excludes: '', 
                                // execCommand: '', 
                                // execTimeout: 120000, 
                                // flatten: false, 
                                // makeEmptyDirs: false, 
                                // noDefaultExcludes: false, 
                                // patternSeparator: '[, ]+', 
                                remoteDirectory: '/home/ec2-user/.deploys/react-app', 
                                // remoteDirectorySDF: false, 
                                removePrefix: 'build', 
                                sourceFiles: 'build/'
                            )
                        ], 
                        usePromotionTimestamp: false, 
                        useWorkspaceInPromotion: false, 
                        verbose: false
                    )
                ])
            }
        }
    }
}
