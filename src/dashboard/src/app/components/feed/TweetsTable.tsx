import { Component } from 'react'
import TweetEmbed from 'react-tweet-embed'
import { AppDispatch, RootState } from '../../redux/store'
import { connect } from 'react-redux'
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment'
import { Box, Grid, Paper, TablePagination } from '@mui/material'
import { getTweetsStatsListAsync, limit, offset } from '../../redux/feed/feed'

interface IProps {
  state: RootState
  dispatch: AppDispatch
}

export class TweetsTable extends Component<IProps> {
  constructor(props: IProps) {
    super(props)
    this.setPage = this.setPage.bind(this)
    this.setLimit = this.setLimit.bind(this)
  }

  private options(
    data: { likes: string; quotes: string; retweets: string; time: string }[]
  ): Highcharts.Options {
    const series = data.reduce(
      (prev, curr) => {
        return {
          likes: [...prev.likes, [+curr.likes]],
          quotes: [...prev.quotes, [+curr.quotes]],
          retweets: [...prev.retweets, [+curr.retweets]]
        }
      },
      { likes: [], quotes: [], retweets: [] } as {
        likes: (string | number)[][]
        quotes: (string | number)[][]
        retweets: (string | number)[][]
      }
    )

    const convertedSeries = Object.entries(series).map(([key, value]) => {
      return {
        type: 'column',
        name: key,
        data: value
      }
    })

    return {
      title: {
        text: undefined
      },
      colors: ['#f58ea9', '#7fdbb5', '#91d2fa'],
      series: convertedSeries as Highcharts.SeriesOptionsType[],
      chart: { backgroundColor: '#00000000' },
      credits: { enabled: false },
      plotOptions: {
        column: {
          dataLabels: {
            color: 'white',
            enabled: true
          }
        }
      },
      xAxis: {
        categories: data.map(row => moment(row.time, 'YYYY-MM-DD hh:mm:ss').format('MM/DD/YYYY')),
        labels: { style: { color: 'white' } },
        minPadding: 0,
        maxPadding: 0
      },
      yAxis: {
        labels: { style: { color: 'white' } },
        title: { text: null }
      },
      legend: {
        itemStyle: { color: 'white' }
      }
    }
  }

  private async setPage(event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) {
    await this.props.dispatch(offset(newPage))
    await this.props.dispatch(getTweetsStatsListAsync(this.props.state))
  }

  private async setLimit(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    await this.props.dispatch(limit(+event.target.value))
    await this.props.dispatch(offset(0))
    await this.props.dispatch(getTweetsStatsListAsync(this.props.state))
  }

  render() {
    return (
      <Box justifyItems="center">
        <Grid direction={'column'} paddingBottom={'100px'}>
          {this.props.state.feed.stats.rows.map((row, index) => (
            <Grid
              item
              component={Paper}
              marginBottom="15px"
              container
              key={index}
              columns={{ xs: 1, md: 2 }}
              justifyContent={'space-around'}
              alignItems={'center'}
            >
              <Grid item alignItems={'center'}>
                <TweetEmbed id={row.id} options={{ theme: 'dark', align: 'center', width: 400 }} />
              </Grid>
              <Grid item alignItems={'center'} maxWidth={700} width="100%">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={this.options(row.stats)}
                  key={index}
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
        <TablePagination
          component={Paper}
          style={{
            position: 'fixed',
            left: '50%',
            bottom: '0px',
            width: '400px',
            transform: 'translate(-50%, -50%)',
            margin: '0 auto'
          }}
          elevation={15}
          count={this.props.state.feed.stats.count}
          page={this.props.state.feed.offset / this.props.state.feed.limit}
          onPageChange={this.setPage}
          rowsPerPage={this.props.state.feed.limit}
          onRowsPerPageChange={this.setLimit}
        />
      </Box>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return { state }
}

export default connect(mapStateToProps)(TweetsTable)
