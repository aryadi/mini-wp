<template>
  <div>
    <div id="main-page" v-if="isLogin || lStorage.firstName">
      <navbar @logout="logout"></navbar>
      <side-bar @changePage="changePage" :lStorage="lStorage" :articleSearchTitle="articleSearchTitle"></side-bar>
      <content-section-article v-if="page === 'articleList'" :articles="articles" @changePage="changePage"
        @deleteArticle="deleteArticle" @showEditPage="showEditPage" @displayArticle="displayArticle">
      </content-section-article>
      <content-section-add v-else-if="page === 'addArticle'" :articleObj="articleObj" @addArticle="addArticle"
        @parseImage="parseImage">
      </content-section-add>
      <display-article-section v-else-if="page === 'displayArticle'" :selectedArticle="selectedArticle">
      </display-article-section>
      <content-section-edit v-else-if="page === 'editArticle'" :articleObj="articleObj" @editArticle="editArticle"
        @parseImage="parseImage"></content-section-edit>
      <footer-section></footer-section>
    </div>
    <div v-else-if="!isLogin || !lStorage.firstName">
      <register-form v-if="page === 'register' && !isLogin" :registerData="registerData" @register="register">
      </register-form>
      <login-form v-else-if="!isLogin || !lStorage" :loginData="loginData" @changePage="changePage" @login="login"
        @onSignIn="onSignIn">
      </login-form>
    </div>
  </div>
</template>

<script>
  import Swal from 'sweetalert2';
  import loginForm from './components/login-form';
  import registerForm from './components/register-form';
  import navbar from './components/navbar';
  import sideBar from './components/sidebar-menu';
  import contentSectionArticle from './components/content-section-article';
  import contentSectionAdd from './components/content-section-add';
  import displayArticleSection from './components/display-article-section';
  import contentSectionEdit from './components/content-section-edit';
  import footer from './components/footer';
  export default {
    mounted() {
      gapi.signin2.render('google-signin-button', {
        onsuccess: this.onSignIn
      })
    },
    components: {
      'login-form': loginForm,
      'register-form': registerForm,
      'navbar': navbar,
      'side-bar': sideBar,
      'content-section-article': contentSectionArticle,
      'content-section-add': contentSectionAdd,
      'display-article-section': displayArticleSection,
      'content-section-edit': contentSectionEdit,
      'footer-section': footer
    },
    data() {
      return {
        isLogin: false,
        message: 'Hello Vue!',
        lStorage: {},
        page: 'articleList',
        registerData: {
          firstName: '',
          lastName: '',
          email: '',
          password: ''
        },
        loginData: {
          email: '',
          password: ''
        },
        articleObj: {
          title: '',
          description: '',
          image: '',
          parsedImage: '',
        },
        articleTitle: '',
        articleDescription: '',
        articleSearchTitle: '',
        titleEdit: '',
        descriptionEdit: '',
        idEdit: '',
        articles: [],
        selectedArticle: {}
      };
    },
    methods: {
      changePage(val) {
        this.articleObj.title = '';
        this.articleObj.description = '';
        this.articleObj.image = '',
          this.articleObj.parsedImage = '',
          this.page = val;
      },
      register() {
        axios({
            method: 'POST',
            url: 'http://localhost:3000/user/register',
            data: this.registerData
          })
          .then((response) => {
            this.page = 'login';
          })
          .catch((err) => {
            console.log(err);
          });
      },
      login() {
        axios({
            method: 'POST',
            url: 'http://localhost:3000/user/login',
            data: this.loginData
          })
          .then((response) => {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('firstName', response.data.user.firstName);
            localStorage.setItem('lastName', response.data.user.lastName);
            this.lStorage['firstName'] = response.data.user.firstName;
            this.lStorage['lastName'] = response.data.user.lastName;
            this.isLogin = true;
            this.page = 'articleList';
          })
          .catch((err) => {
            Swal.fire({
              title: 'Email or Password wrong',
              text: 'Please enter correct email/password',
              type: 'error',
              confirmButtonText: 'Continue'
            })
            console.log(err);
          });
      },
      onSignIn(googleUser) {
        const idToken = googleUser.getAuthResponse().id_token;

        axios
          .post(`http://localhost:3000/user/tokensignin`, {
            idToken
          })
          .then(({
            data
          }) => {
            localStorage.setItem('access_token', data.accessToken);
            this.page = 'articleList';
            this.isLogin = true;
            console.log('masuk method');
          })
          .catch(function (err) {
            console.log(err);
          });
      },
      logout() {


        this.isLogin = false;
        this.lStorage = {};
        localStorage.clear();
        const auth2 = gapi.auth2.getAuthInstance();

        auth2
          .signOut()
          .then(() => {
            console.log('User signed out.');
          })
          .catch(function (err) {
            console.log(err);
          });

        function onLoad() {
          gapi.load('auth2', function () {
            gapi.auth2.init();
          });
        }
      },
      displayArticle(id) {
        for (let article of this.articles) {
          if (article._id == id) {
            this.selectedArticle = article;
          }
        }
        this.page = 'displayArticle';
      },
      addArticle() {
        if (this.articleObj.title.length == 0) {
          Swal.fire({
            title: 'Oops',
            text: 'Title cannot be empty',
            type: 'error',
            confirmButtonText: 'Cool'
          })
          return '';
        }
        let formData = new FormData();
        formData.append('title', this.articleObj.title);
        formData.append('img', this.articleObj.parsedImage);
        formData.append('description', this.articleObj.description);
        axios({
            method: 'POST',
            url: 'http://localhost:3000/api/articles',
            data: formData,
            headers: {
              token: localStorage.getItem('token')
            },
            config: {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          })
          .then((response) => {
            this.articleObj.title = '';
            this.articleObj.description = '';
            this.articles.push(response.data);
            this.changePage('articleList');
            Swal.fire(
              'Success',
              'Data added succesfully',
              'success'
            )
          })
          .catch((err) => {
            Swal.fire({
              title: 'Oops',
              text: 'Something Wrong',
              type: 'error',
              confirmButtonText: 'Cool'
            })
            console.log(err);
          })
      },
      showEditPage(id) {
        for (const article of this.articles) {
          if (id == article._id) {
            this.selectedArticle = article;
          }
        }
        this.idEdit = id;
        this.articleObj.title = this.selectedArticle.title;
        this.articleObj.description = this.selectedArticle.content;
        this.articleObj.image = this.selectedArticle.image;
        this.page = 'editArticle';
      },
      editArticle() {
        if (this.articleObj.title.length == 0) {
          Swal.fire({
            title: 'Oops',
            text: 'Title cannot be empty',
            type: 'error',
            confirmButtonText: 'Cool'
          })
          return '';
        }
        let formDataEdit = new FormData();
        formDataEdit.append('title', this.articleObj.title);
        formDataEdit.append('img', this.articleObj.parsedImage);
        formDataEdit.append('description', this.articleObj.description);
        axios({
            method: 'PATCH',
            url: `http://localhost:3000/api/articles/${this.idEdit}`,
            data: formDataEdit,
            headers: {
              token: localStorage.getItem('token')
            },
            config: {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          })
          .then((response) => {
            let articleIndex = -1;
            for (let i = 0; i < this.articles.length; i++) {
              if (this.articles[i]._id == this.idEdit) {
                articleIndex = i;
              }
            }
            this.articles[articleIndex].title = this.articleObj.title;
            this.articles[articleIndex].content = this.articleObj.description;
            this.articles[articleIndex].image = this.articleObj.image;
            this.idEdit = '';
            this.titleEdit = '';
            this.descriptionEdit = '';
            this.changePage('articleList');
            Swal.fire(
              'Success',
              'Data edited succesfully',
              'success'
            );
          })
          .catch((err) => {
            console.log(err);

            Swal.fire({
              title: 'Oops',
              text: 'Something Wrong',
              type: 'error',
              confirmButtonText: 'Cool'
            })
          })
      },
      deleteArticle(id) {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.value) {
            axios({
                method: 'DELETE',
                url: `http://localhost:3000/api/articles/${id}`,
                headers: {
                  token: localStorage.getItem('token')
                },
              })
              .then((response) => {
                let articleIndex = -1;
                for (let i = 0; i < this.articles.length; i++) {
                  if (this.articles[i]._id == this.idEdit) {
                    articleIndex = i;
                  }
                }
                this.articles.splice(articleIndex, 1);
                this.page = 'articleList';
                Swal.fire(
                  'Success',
                  'Data deleted succesfully',
                  'success'
                );
              })
              .catch((err) => {
                console.log(err);
                Swal.fire({
                  title: 'Oops',
                  text: 'Something Wrong',
                  type: 'error',
                  confirmButtonText: 'Cool'
                })
              });
          }
        })
      },
      parseImage(event) {
        var file = event.target.files[0];

        if (event.target.files[0]) {
          this.articleObj.parsedImage = file;
        } else {
          this.articleObj.parsedImage =
            "https://images.unsplash.com/photo-1536148935331-408321065b18?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60";
        }

        var reader = new FileReader();

        reader.onloadend = () => {
          this.articleObj.image = reader.result;
        }

        if (file) {
          this.articleObj.image = reader.readAsDataURL(file);
        } else {
          this.articleObj.image =
            "https://images.unsplash.com/photo-1536148935331-408321065b18?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60";
        }
      },
    },
    created() {
      axios({
          method: 'GET',
          url: 'http://localhost:3000/api/articles'
        })
        .then(({
          data
        }) => {
          this.articles = data;
        })
        .catch((err) => {
          console.log(err);
        });

      this.lStorage['firstName'] = localStorage.getItem('firstName');
      this.lStorage['lastName'] = localStorage.getItem('lastName');

    },
    computed: {
      filteredArticle() {
        return this.articles.filter((article) => {
          return article.title.toLowerCase().includes(this.articleSearchTitle.toLowerCase());
        })
      }
    }
  }
</script>

<style scoped>

</style>
