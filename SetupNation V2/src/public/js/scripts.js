$(function() {
  // Post Toggle View
  $('#post-comment').hide();
  $('#btn-toggle-comment').click(e => {
    e.preventDefault();
    $('#post-comment').slideToggle();
  });
  
  // Like Button Request
  $('#btn-like').click(function(e) {
    e.preventDefault();
    let imgId = $(this).data('id');
    console.log(imgId)
    $.post('/images/' + imgId + '/like')
      .done(data => {
      console.log('back:', data)
        $('.likes-count').text(data.likes);
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
