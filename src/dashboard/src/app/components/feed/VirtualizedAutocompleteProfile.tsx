import React, { Component, SyntheticEvent } from 'react'
import TextField from '@mui/material/TextField'
import { Autocomplete } from '@mui/material'
import { AppDispatch, RootState } from '../../redux/store'
import { connect } from 'react-redux'
import {
  getAllSpiesAsync,
  getTweetsStatsListAsync,
  offset,
  setProfile
} from '../../redux/feed/feed'
import { showError } from '../../redux/alerts/alerts'

// export default function ComboBox() {
//   return (
//     <Autocomplete
//       disablePortal
//       id="combo-box-demo"
//       options={top100Films}
//       sx={{ width: 300 }}
//       renderInput={params => <TextField {...params} label="Movie" />}
//     />
//   )
// }

interface IProps {
  state: RootState
  dispatch: AppDispatch
  placeholder: string
}

interface IState {
  selectedOption: CategorizedOptions | null
}

interface CategorizedOptions {
  label: string
  category: string
}

export class VirtualizedAutocompleteProfile extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.setProfile = this.setProfile.bind(this)
    this.state = { selectedOption: null }
  }

  async componentDidMount() {
    await this.props.dispatch(getAllSpiesAsync(this.props.state))

    this.setState({
      ...this.state,
      selectedOption:
        this.options().find(option => option.label === this.props.state.feed.profile) ?? null
    })
  }

  private options(): CategorizedOptions[] {
    const { spies } = this.props.state.feed
    if (spies !== null) {
      return spies.reduce((prev: CategorizedOptions[], curr) => {
        return [
          ...prev,
          ...curr.profileNames.map(profileName => {
            return { label: profileName, category: curr.name }
          })
        ]
      }, [])
    }
    return []
  }

  private async setProfile(
    _event: SyntheticEvent<Element, Event>,
    option: CategorizedOptions | null
  ) {
    if (option) {
      await this.props.dispatch(setProfile(option.label))
      this.setState({ ...this.state, selectedOption: option })
      await this.props.dispatch(offset(0))

      await this.props.dispatch(getTweetsStatsListAsync(this.props.state))
    }
  }

  render() {
    return (
      <Autocomplete
        disablePortal
        options={this.options()}
        sx={{ width: 300 }}
        groupBy={option => option.category}
        value={this.state.selectedOption}
        onChange={this.setProfile}
        isOptionEqualToValue={(option, value) =>
          option?.label === value?.label && option?.category === value?.category
        }
        renderInput={params => <TextField {...params} label={this.props.placeholder} />}
      />
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return { state }
}
export default connect(mapStateToProps)(VirtualizedAutocompleteProfile)
