import React, { useEffect } from "react"
import { Formik, Form } from "formik"
import * as yup from "yup"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Autocomplete from "@material-ui/lab/Autocomplete"
import ThemeProvider from "@material-ui/styles/ThemeProvider"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Recaptcha from "react-recaptcha"
import theme from "../../theme"

import Layout from "../../components/layout"
import SEO from "../../components/seo"

import countries from "./countries"

import "./style.css"

// ISO 3166-1 alpha-2
// ⚠️ No support for IE 11
function countryToFlag(isoCode: string) {
  return typeof String.fromCodePoint !== "undefined"
    ? isoCode
        .toUpperCase()
        .replace(/./g, char =>
          String.fromCodePoint(char.charCodeAt(0) + 127397)
        )
    : isoCode
}

const siteKey = process.env.RECAPTCHA_SITE_KEY

const validationSchema = yup
  .object({
    name: yup.string().required("Fullname is required"),
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
    phone: yup
      .string()
      .min(8, "Phone should be of minimum 8 characters length")
      .required("Phone number is required"),
  })
  .shape({
    location: yup.string().required("Location is required"),
    recaptcha: yup.string().required(),
  })

const RegisterClinician = () => {
  const initialValues = {
    name: "",
    email: "",
    phone: "",
    location: "",
    recaptcha: "",
    message: ""
  }

  const onSubmit = (values: any) => {
    console.log(JSON.stringify(values, null, 2))
  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <SEO title="Get in touch" />
        <Paper className={`contact-form`} elevation={3}>
          <Typography variant="h5" className={`title`}>
            Get in touch
          </Typography>
          <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={onSubmit}
          >
            {({ handleChange, values, errors, touched, setFieldValue }) => (
              <Form>
                <TextField
                  fullWidth
                  className="textfield"
                  id="name"
                  name="name"
                  label="Full Name"
                  variant="filled"
                  value={values.name}
                  onChange={handleChange}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
                <TextField
                  fullWidth
                  className="textfield"
                  id="email"
                  name="email"
                  label="Email"
                  variant="filled"
                  value={values.email}
                  onChange={handleChange}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                <TextField
                  fullWidth
                  className="textfield"
                  id="phone"
                  name="phone"
                  label="Phone number"
                  type="phone"
                  variant="filled"
                  value={values.phone}
                  onChange={handleChange}
                  error={touched.phone && Boolean(errors.phone)}
                  helperText={touched.phone && errors.phone}
                />
                <Autocomplete
                  id="country-select"
                  options={countries}
                  autoHighlight
                  className="textfield"
                  getOptionLabel={option => option.label}
                  renderOption={option => (
                    <React.Fragment>
                      <span>{countryToFlag(option.code)}</span>
                      {option.label}
                    </React.Fragment>
                  )}
                  onChange={(e, value) => {
                    setFieldValue(
                      "location",
                      value !== null ? value.code : initialValues.location
                    )
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Choose your country"
                      variant="filled"
                      inputProps={{
                        ...params.inputProps,
                      }}
                      value={values.location}
                      error={touched.location && Boolean(errors.location)}
                      helperText={touched.location && errors.location}
                    />
                  )}
                />
                <TextField
                  fullWidth
                  multiline
                  className="textfield"
                  rows={4}
                  id="message"
                  name="message"
                  label="Your message"
                  variant="filled"
                  value={values.message}
                  onChange={handleChange}
                  error={touched.message && Boolean(errors.message)}
                  helperText={touched.message && errors.message}
                />
                <Recaptcha
                  sitekey={siteKey}
                  render="explicit"
                  verifyCallback={(response: any) => {
                    setFieldValue("recaptcha", response)
                  }}
                  onloadCallback={() => {
                    console.log("done loading!")
                  }}
                />
                <Button
                  size="large"
                  className="submit"
                  color="primary"
                  variant="contained"
                  fullWidth
                  type="submit"
                >
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Paper>
      </Layout>
    </ThemeProvider>
  )
}

export default RegisterClinician