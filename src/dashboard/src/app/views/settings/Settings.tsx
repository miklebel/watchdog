import { SwitchAccount as SwitchAccountIcon } from '@mui/icons-material'
import { TabContext, TabPanel } from '@mui/lab'
import { Container, Tab, Tabs } from '@mui/material'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import AccountTable from '../../components/settings/accounts/AccountTable'
import { SettingsTabs } from '../../constants'
import { AppDispatch, RootState } from '../../redux/store'

interface IProps {
  state: RootState
  dispatch: AppDispatch
}

interface IState {
  tab: SettingsTabs
}

class Settings extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      tab: SettingsTabs.ACCOUNTS
    }
    this.setTab = this.setTab.bind(this)
  }

  private setTab(event: React.SyntheticEvent, value: SettingsTabs) {
    this.setState({ ...this.state, tab: value })
  }

  render() {
    return (
      <Container maxWidth="lg" style={{ marginTop: '20px' }}>
        <TabContext value={this.state.tab}>
          <Tabs
            value={this.state.tab}
            variant="fullWidth"
            centered
            scrollButtons="auto"
            onChange={this.setTab}
            aria-label="icon position tabs example"
          >
            <Tab
              icon={<SwitchAccountIcon />}
              iconPosition="start"
              label="Accounts"
              value={SettingsTabs.ACCOUNTS}
            />
          </Tabs>
          <TabPanel value={SettingsTabs.ACCOUNTS} style={{ padding: '10px 0 0 0' }}>
            <AccountTable />
          </TabPanel>
        </TabContext>
      </Container>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return { state }
}

export default connect(mapStateToProps)(Settings)
