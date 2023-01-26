let page = 1;
let perPage = 10;

function loadMovieData(title = null) {
  let url = `https://unusual-boa-bedclothes.cyclic.app/api/movies/?page=${page}&perPage=${perPage}`;
  if (title) {
    url += `&title=${title}`;
    document.querySelector(".pagination").classList.add("d-none");
  } else {
    document.querySelector(".pagination").classList.remove("d-none");
  }

  fetch(url)
    .then((movieData) => movieData.json())
    .then(function (movieData) {
      let displayRows = "";

      for (let i = 0; i < movieData.length; i++) {
        let plot = movieData[i].plot || "N/A";
        let rated = movieData[i].rated || "N/A";
        let runtime = `${Math.floor(movieData[i].runtime / 60)}:${(
          movieData[i].runtime % 60
        )
          .toString()
          .padStart(2, "0")}`;
        displayRows += `<tr data-id="${movieData[i]._id}">
                <td>${movieData[i].year}</td>
                <td>${movieData[i].title}</td>
                <td>${plot}</td>
                <td>${rated}</td>
                <td>${runtime}</td>
            </tr>`;
      }

      document.querySelector("#moviesTable tbody").innerHTML = displayRows;
      document.querySelector("#current-page").innerHTML = page;

      let displayMovieRows = document.querySelectorAll("#moviesTable tbody tr");
      displayMovieRows.forEach((row) => {
        row.addEventListener("click", (e) => {
          let id = e.currentTarget.getAttribute("data-id");
          fetch(`https://unusual-boa-bedclothes.cyclic.app/api/movies/${id}`)
            .then((data) => data.json())
            .then((data) => {
              document.querySelector(".modal-title").innerHTML = data.title;
              let body = document.querySelector(".modal-body");
              let poster = data.poster || "";
              if (poster == "") {
                body.innerHTML = `<strong>Directed By:</strong> ${data.directors.join(
                  ", "
                )}<br><br>
                    <p>${data.fullplot}</p>
                    <strong>Cast:</strong> ${data.cast.join(", ")}<br><br>
                    <strong>Awards:</strong> ${data.awards.text}<br>
                    <strong>IMDB Rating:</strong> ${data.imdb.rating} (${
                  data.imdb.votes
                } votes)`;
              } else {
                body.innerHTML = `<img class="img-fluid w-100" src="${poster}"><br><br>
                    <strong>Directed By:</strong> ${data.directors.join(
                      ", "
                    )}<br><br>
                    <p>${data.fullplot}</p>
                    <strong>Cast:</strong> ${data.cast.join(", ")}<br><br>
                    <strong>Awards:</strong> ${data.awards.text}<br>
                    <strong>IMDB Rating:</strong> ${data.imdb.rating} (${
                  data.imdb.votes
                } votes)`;
              }

              let myModal = new bootstrap.Modal(
                document.getElementById("detailsModal"),
                {
                  backdrop: "static",
                  keyboard: false,
                  focus: true,
                }
              );
              myModal.show();
            });
        });
      });
    });
}

loadMovieData();

document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector("#previous-page")
    .addEventListener("click", function () {
      if (page > 1) {
        page--;
        loadMovieData();
      }
    });

  document.querySelector("#next-page").addEventListener("click", function () {
    page++;
    loadMovieData();
  });

  document
    .querySelector("#searchForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      loadMovieData(document.querySelector("#title").value);
    });

  document.querySelector("#clearForm").addEventListener("click", function () {
    document.querySelector("#title").value = "";
    loadMovieData();
  });
});
