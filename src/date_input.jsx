import React from 'react'
import { isSameDay, isDayDisabled, parseDate, safeDateFormat } from './date_utils'

var DateInput = React.createClass({
  displayName: 'DateInput',

  propTypes: {
    customInput: React.PropTypes.element,
    date: React.PropTypes.object,
    dateFormat: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.array
    ]),
    disabled: React.PropTypes.bool,
    excludeDates: React.PropTypes.array,
    filterDate: React.PropTypes.func,
    includeDates: React.PropTypes.array,
    locale: React.PropTypes.string,
    maxDate: React.PropTypes.object,
    minDate: React.PropTypes.object,
    onBlur: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onChangeDate: React.PropTypes.func
  },

  getDefaultProps () {
    return {
      dateFormat: 'L'
    }
  },

  getInitialState () {
    return {
      value: safeDateFormat(this.props.date, this.props)
    }
  },

  componentWillReceiveProps (newProps) {
    const inputDate = parseDate(this.state.value, newProps)
    const dateChanged = !isSameDay(newProps.date, this.props.date) &&
          !isSameDay(newProps.date, inputDate)
    console.log('DateInput new props. Changed =', dateChanged, {newProps, oldProps: this.props, inputDate, state: this.state})
    if (dateChanged ||
          newProps.locale !== this.props.locale ||
          newProps.dateFormat !== this.props.dateFormat) {
      this.setState({
        value: safeDateFormat(newProps.date, newProps)
      })
    }
  },

  handleChange (event) {
    console.log('handleChange(', event, ')')
    if (this.props.onChange) {
      this.props.onChange(event)
    }
    if (!event.defaultPrevented) {
      this.handleChangeDate(event.target.value)
    }
  },

  handleChangeDate (value) {
    console.log('handleChangeDate(', value, ')')
    this.setState({value})
    if (this.props.onChangeDate) {
      var date = parseDate(value, this.props)
      if (date && !isDayDisabled(date, this.props)) {
        this.props.onChangeDate(date)
      } else if (value === '') {
        this.props.onChangeDate(null)
      }
    }
  },

  handleBlur (event) {
    this.setState({
      value: safeDateFormat(this.props.date, this.props)
    })
    if (this.props.onBlur) {
      this.props.onBlur(event)
    }
  },

  focus () {
    this.refs.input.focus()
  },

  render () {
    const { customInput, date, locale, minDate, maxDate, excludeDates, includeDates, filterDate, dateFormat, onChangeDate, ...rest } = this.props // eslint-disable-line no-unused-vars

    if (customInput) {
      return React.cloneElement(customInput, {
        ...rest,
        ref: 'input',
        value: this.state.value,
        onBlur: this.handleBlur,
        onChange: this.handleChange
      })
    }

    return <input
        ref="input"
        type="text"
        {...rest}
        value={this.state.value}
        onBlur={this.handleBlur}
        onChange={this.handleChange} />
  }
})

module.exports = DateInput
