$(function() {
  // Post Toggle View
  $('#post-comment').hide();
  $('#btn-toggle-comment').click(e => {
    
    // accion realizada despues del click en el post
    e.preventDefault();
    $('#post-comment').slideToggle();
    
  });
  
  // Like Button Request
  $('#btn-like').click(function(e) {  
    e.preventDefault();
    let imgId = $(this).data('id');
    console.log(imgId)
    console.log("sexo")

  $.post('/images/' + imgId + '/like')  // Realiza la solicitud POST
    .done(function(data) {
      console.log('back:', data);
      $('.likes-count').text(data.likes);  // Actualiza el contador de likes en la vista
    })
    .fail(function(err) {
      console.log('Error:', err);  // Imprime el error si la solicitud falla
    });
  });

  // Delete Button Request
  $('#btn-delete').click(function (e) {
    e.preventDefault();
    let $this = $(this);
    const response = confirm('Are you sure you want to delete this image?');
    if (response) {
      let imgId = $(this).data('id');
      $.ajax({
        url: '/images/' + imgId,
        type: 'DELETE'
      })
      .done(function(result) {
        window.location.href = "/";
      })
      .fail(function(err) {
        console.error(err);
        alert('Error deleting image');
      });
      
    }
  });
});
