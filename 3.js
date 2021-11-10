function soal3 (n) {
    var mid = n / 2 - 0.5;
    
    for(var i = 0; i < n; i++){
        for(var j = 0; j < n; j++){
            if( i == 0 && j == 0 ){
                process.stdout.write("* ");
            }
            else if( i == 0 && j == n - 1){
                process.stdout.write("* ");
            }
            else if( i == n - 1 && j == n - 1){
                process.stdout.write("* ");
            }
            else if( i == n - 1 && j == 0){
                process.stdout.write("* ");
            }
            else if( i == mid && j != mid){
                process.stdout.write("* ");
            }
            else if( i != mid && j == mid){
                process.stdout.write("* ");
            }
            else {
                process.stdout.write("# ");
            }
        }
        console.log();
    }
}

soal3(5);