function HitungBarang(t, q){
    var total = 0, potongan = 0;

    if(t == 'A'){
        total = 4550 * q;
        if(q > 13){
            potongan  = 231 * q;
        } 
    }

    else if(t == 'B'){
        total = 5330 * q;
        if(q > 7){
            potongan = q * (23/100);
        }
    }

    else if(t == 'C'){
            total =  q * 8653;
    }

    var totalAkhir = total - potongan;
    console.log("- Total harga barang: " + total );
    console.log("- Total harga barang: " + potongan );
    console.log("- Total harga barang: " + totalAkhir );
}


HitungBarang(ql, qn);