$(document).ready(function(){
    $.getJSON('/food/fetchallfoodcuisine',function(data){
        data.map((item)=>{
         $('#food').append($('<option>').text(item.foodcuisinename).val(item.foodid))
        })
    })

    $('#food').change(function(){
        $.getJSON('/food/fetchallfooditems',{foodid:$('#food').val()},function(data){
            $('#fooditem').empty()
            $('#fooditem').append($('<option>').text('-Select food item-'))
            data.map((item)=>{
                $('#fooditem').append($('<option>').text(item.fooditemname).val(item.fooditemid))
            })
        })
    })


})