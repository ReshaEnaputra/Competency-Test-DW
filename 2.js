function bubbleSort(arr){
    for(var i = 0; i < arr.length; i++){
      for(var j = 0; j < ( arr.length - i -1 ); j++){
          if(arr[j] > arr[j+1]){
            var temp = arr[j]
            arr[j] = arr[j + 1]
            arr[j+1] = temp
          }
      }
    }
  
    console.log(arr);
  }
  
  var arr = [ 20, 12, 35, 11, 17, 9, 58, 23, 69, 21];
  
  bubbleSort(arr);