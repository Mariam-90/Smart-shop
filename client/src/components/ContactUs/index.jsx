import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import './style.css'; // Import the CSS file

const ContactUs = () => {
    const { control, handleSubmit, formState: { errors }, setValue } = useForm();
    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('message', data.message);
        if (data.files && data.files.length > 0) {
            for (let i = 0; i < data.files.length; i++) {
                formData.append('files', data.files[i]);
            }
        }

        try {
            const response = await axios.post('http://localhost:3000/api/contact', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Response:', response);
            alert('הודעה נשלחה בהצלחה');
        } catch (error) {
            console.error('Error sending message', error);
            alert('שגיאה בשליחת ההודעה');
        }
    };

    const handleFileChange = (event) => {
        setValue('files', event.target.files);
    };

    return (
        <Container className="contact-container">
            <h2>דבר איתנו</h2>
                    <Form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="contact-form">
                        <Form.Group controlId="formName">
                            <Form.Label>שם:</Form.Label>
                            <Controller
                                name="name"
                                control={control}
                                defaultValue=""
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Form.Control type="text" placeholder="הכנס את שמך" {...field} />
                                )}
                            />
                            {errors.name && <p className="text-danger">שדה זה הינו חובה</p>}
                        </Form.Group>

                        <Form.Group controlId="formEmail">
                            <Form.Label>דוא"ל:</Form.Label>
                            <Controller
                                name="email"
                                control={control}
                                defaultValue=""
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Form.Control type="email" placeholder='הכנס את דוא"ל שלך' {...field} />
                                )}
                            />
                            {errors.email && <p className="text-danger">שדה זה הינו חובה</p>}
                        </Form.Group>

                        <Form.Group controlId="formMessage">
                            <Form.Label>הודעה:</Form.Label>
                            <Controller
                                name="message"
                                control={control}
                                defaultValue=""
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Form.Control as="textarea" rows={3} placeholder="כתוב את ההודעה שלך כאן" {...field} />
                                )}
                            />
                            {errors.message && <p className="text-danger">שדה זה הינו חובה</p>}
                        </Form.Group>

                        <Form.Group controlId="formFile">
                            <Form.Label>צרף מסמכים:</Form.Label>
                            <Form.Control type="file" multiple onChange={handleFileChange} />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3">
                            שלח
                        </Button>
                    </Form>
        </Container>
    );
}

export default ContactUs;
