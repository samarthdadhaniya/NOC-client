import axios from "axios";

class Auth {

    constructor() {
        this.api = axios.create({
            baseURL: `/api/v1/`,
            withCredentials: true
        });
    }

    // Register Function
    async createAccount({ firstName, lastName, email, password }) {
        try {
            const response = await this.api.post('users/register', {
                firstName,
                lastName,
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            if (error.response.data) {
                throw error.response.data.message;
            } else {
                throw error
            }
        }
    }

    // Login Function
    async login({ email, password }) {
        try {
            const response = await this.api.post('users/login', {
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response);
            return response.data;
        } catch (error) {
            if (error.response.data) {
                throw error.response.data.message;
            } else {
                throw error
            }
        }
    }

    // updateAccount
    async updateAccount({ lastName, firstName, password, profileImage }, token) {
        try {
            const formData = new FormData();
            formData.append('lastName', lastName);
            formData.append('firstName', firstName);
            formData.append('password', password);
            if (profileImage) {
                formData.append('profileImage', profileImage);
            }


            const response = await this.api.patch('users/updateProfile', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            if (error.response.data) {
                throw error.response.data.message;
            } else {
                throw error
            }
        }
    }
    

    async updateAdmin(status, id, token) {
        try {
            const response = await this.api.patch(
                `users/updateIsAdminField`,
                {
                    userId:id,
                    isAdmin:status
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return response.data;
        } catch (error) {
            if (error.response.data) {
                throw error.response.data.message;
            } else {
                throw error
            }
        }
    }


    //Get Current User
    async getAuthUser(token) {
        console.log(token);
        try {
            const response = await this.api.get('users/getCurrentUser', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log(response.data);
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
            // if (error.response.data) {
            //     throw error.response.data.message;
            // } else {
            //     throw error
            // }
        }
    }

    // ChangePassword
    async changePassword(password, newPassword, token) {
        try {
            const response = await this.api.patch('users/changePassword', {
                password,
                newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            if (error.response.data) {
                throw error.response.data.message;
            } else {
                throw error
            }
        }
    }

    async getAllUser(token) {
        try {
            const response = await this.api.get('users/getAllUser', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            if (error.response.data) {
                throw error.response.data.message;
            } else {
                throw error
            }
        }
    }


    // Logout Function
    async logout(token) {
        console.log(token);
        try {
            const response = await this.api.post("users/logout", null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data
        } catch (error) {
            if (error.response.data) {
                throw error.response.data.message;
            } else {
                throw error
            }
        }
    }


    async refreshToken(id) {
        // console.log(id);
        try {
            const response = await this.api.get('auth/refresh-token', {
                params: {
                    param1: id,
                }
            });
            return response.data;
        } catch (error) {
            if (error.response.data) {
                throw error.response.data.message;
            } else {
                throw error
            }
        }
    }

    

}

const AuthService = new Auth();
export default AuthService