/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { FaFileUpload } from 'react-icons/fa'
import chainEventHandler from '../../utilities/chainEventHandler'


const DEFAULT_CUSTOM = true
const DEFAULT_LABEL = (
  <div className="d-flex flex-column">
    <h5 className="text-center text-custom-primary">
      Drag n&apos; drop some photos here, put them
      <br />
      into albums in the next step
    </h5>
    <p className="text-center mt-4">
      <u>
        Upload from computer
        {' '}
        <FaFileUpload />
      </u>
    </p>
  </div>
)

const FileInput = ({
  onValueChange,
  onChange,
  upload,
  label,
  id,
  name,
  custom,
  className,
  ...props
}) => {
  const [value, setValue] = useState(null)

  const handleChange = chainEventHandler((event) => {
    const { files } = event.target
    const filesArray = Object.values(files)
    const newValue = filesArray.map((file) => file.name).join(', ')
    setValue(newValue)
    if (onValueChange) onValueChange(filesArray)
    if (upload) filesArray.forEach((file) => upload(file))
  }, onChange)

  const inputContent = (
    <input
      type="file"
      className={classNames(className, { 'custom-file-input': custom })}
      id={id || name}
      name={name}
      onChange={handleChange}
      {...props}
    />
  )

  if (custom) {
    return (
      <div className="custom-file">
        {inputContent}
        <label className="custom-file-label" htmlFor={id || name}>
          {value || label}
        </label>
      </div>
    )
  }

  return inputContent
}

FileInput.propTypes = {
  onChange: PropTypes.func,
  onValueChange: PropTypes.func,
  upload: PropTypes.func.isRequired,
  label: PropTypes.node,
  name: PropTypes.string,
  id: PropTypes.string,
  custom: PropTypes.bool
}

FileInput.defaultProps = {
  onChange: undefined,
  onValueChange: undefined,
  label: DEFAULT_LABEL,
  name: undefined,
  id: undefined,
  custom: DEFAULT_CUSTOM
}

export default FileInput
