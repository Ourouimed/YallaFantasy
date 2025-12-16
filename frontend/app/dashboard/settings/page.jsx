"use client"
import DashboardLayout from "@/components/dashboard/dashboardLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useToast } from "@/hooks/useToast";
import { getAllrounds } from "@/store/features/rounds/roundsSlice";
import { getSettings, saveSettings } from "@/store/features/settings/settingsSlice";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const toast = useToast();

  const { settings, isLoading } = useSelector((state) => state.settings);

  const [settingsData, setSettingsData] = useState({
    yellow_card: 0,
    red_card: 0,
    assist : 0 ,
    pen_missed: 0,
    own_goal: 0,
    gk_save : 0 ,
    goal_for_FWD: 0,
    goal_for_MID: 0,
    goal_for_DEF: 0,
    goal_for_GK: 0,
    clean_sheets_def: 0,
    clean_sheets_gk: 0,
    clean_sheets_mid: 0,
    pen_saves: 0,
    conceded_goal: 0,
  });

  useEffect(() => {
    dispatch(getAllrounds());
    dispatch(getSettings());
  }, [dispatch]);


  useEffect(() => {
  if (settings) {
    setSettingsData({
      yellow_card: settings.yellow_card ?? 0,
      assist : settings.assist ?? 0 , 
      red_card: settings.red_card ?? 0,
      pen_missed: settings.pen_missed ?? 0,
      own_goal: settings.own_goal ?? 0,
      gk_save : settings.gk_save ?? 0 ,
      goal_for_FWD: settings.goal_for_FWD ?? 0,
      goal_for_MID: settings.goal_for_MID ?? 0,
      goal_for_DEF: settings.goal_for_DEF ?? 0,
      goal_for_GK: settings.goal_for_GK ?? 0,
      clean_sheets_def: settings.clean_sheets_def ?? 0,
      clean_sheets_gk: settings.clean_sheets_gk ?? 0,
      clean_sheets_mid: settings.clean_sheets_mid ?? 0,
      pen_saves: settings.pen_saves ?? 0,
      conceded_goal: settings.conceded_goal ?? 0,
    });
  }
}, [settings]);





  const handleChange = (e) => {
    setSettingsData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveSettings = async ()=>{
      try {
        await dispatch(saveSettings(settingsData)).unwrap()
        toast.success('new settings saved successfully')
      }
      catch (err){
        console.log(err)
        toast.error(err)
      }
  }

  return (
    <DashboardLayout>
      <div className="space-y-7">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-gray-700">
              Manage AFCON2025 settings and rules
            </p>
          </div>

          <Button className={`!bg-black text-white ${isLoading && "opacity-70"}`} onClick={handleSaveSettings} disabled={isLoading}>{isLoading ? 'Saving...' : 'Save settings'}<Save/></Button>
        </div>

        <div className="border border-gray-300 rounded-md">
          <div className="py-3 px-4 border-b border-gray-300">
            <h4 className="text-2xl font-semibold">General settings</h4>
          </div>

          <div className="py-3 px-4 space-y-4">
    

            {/* Two inputs per row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">
                  Assist
                </label>
                <Input
                  type="number"
                  name="assist"
                  value={settingsData.assist}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">
                  Yellow card
                </label>
                <Input
                  type="number"
                  name="yellow_card"
                  value={settingsData.yellow_card}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">
                  Red card
                </label>
                <Input
                  type="number"
                  name="red_card"
                  value={settingsData.red_card}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">
                  Penalty missed
                </label>
                <Input
                  type="number"
                  name="pen_missed"
                  value={settingsData.pen_missed}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">
                  Own goal
                </label>
                <Input
                  type="number"
                  name="own_goal"
                  value={settingsData.own_goal}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>


        <div className="border border-gray-300 rounded-md">
          <div className="py-3 px-4 border-b border-gray-300">
            <h4 className="text-2xl font-semibold">Gk settings</h4>
          </div>

          <div className="py-3 px-4 space-y-4">

            {/* Two inputs per row */}
            <div className="grid grid-cols-2 gap-4">
              

             
              
        
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">
                  Goal for GK
                </label>
                <Input
                  type="number"
                  name="goal_for_GK"
                  value={settingsData.goal_for_GK}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">
                  Clean sheets GK
                </label>
                <Input
                  type="number"
                  name="clean_sheets_gk"
                  value={settingsData.clean_sheets_gk}
                  onChange={handleChange}
                />
              </div>


              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">
                  GK saves
                </label>
                <Input
                  type="number"
                  name="gk_save"
                  value={settingsData.gk_save}
                  onChange={handleChange}
                />
              </div>

              

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">
                  Penalty saves
                </label>
                <Input
                  type="number"
                  name="pen_saves"
                  value={settingsData.pen_saves}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">
                  Conceded goal
                </label>
                <Input
                  type="number"
                  name="conceded_goal"
                  value={settingsData.conceded_goal}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fowrward */}
        <div className="border border-gray-300 rounded-md">
          <div className="py-3 px-4 border-b border-gray-300">
            <h4 className="text-2xl font-semibold">FWD settings</h4>
          </div>

          <div className="py-3 px-4 space-y-4">

            {/* Two inputs per row */}
            <div className="grid grid-cols-2 gap-4">
              

             
              
        
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">
                  Goal for FWD
                </label>
                <Input
                  type="number"
                  name="goal_for_FWD"
                  value={settingsData.goal_for_FWD}
                  onChange={handleChange}
                />
              </div>

            </div>
          </div>
        </div>

        {/* Defender */}
        <div className="border border-gray-300 rounded-md">
          <div className="py-3 px-4 border-b border-gray-300">
            <h4 className="text-2xl font-semibold">DEF settings</h4>
          </div>

          <div className="py-3 px-4 space-y-4">

            {/* Two inputs per row */}
            <div className="grid grid-cols-2 gap-4">
              

             
              
        
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">
                  Goal for Def
                </label>
                <Input
                  type="number"
                  name="goal_for_DEF"
                  value={settingsData.goal_for_DEF}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">
                  Clean sheets DEF
                </label>
                <Input
                  type="number"
                  name="clean_sheets_def"
                  value={settingsData.clean_sheets_def}
                  onChange={handleChange}
                />
              </div>

              

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">
                  Conceded goal
                </label>
                <Input
                  type="number"
                  name="conceded_goal"
                  value={settingsData.conceded_goal}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Midfilder */}
        <div className="border border-gray-300 rounded-md">
          <div className="py-3 px-4 border-b border-gray-300">
            <h4 className="text-2xl font-semibold">MID settings</h4>
          </div>

          <div className="py-3 px-4 space-y-4">

            {/* Two inputs per row */}
            <div className="grid grid-cols-2 gap-4">
              

             
              
        
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">
                  Goal for MID
                </label>
                <Input
                  type="number"
                  name="goal_for_MID"
                  value={settingsData.goal_for_MID}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">
                  Clean sheets MID
                </label>
                <Input
                  type="number"
                  name="clean_sheets_mid"
                  value={settingsData.clean_sheets_mid}
                  onChange={handleChange}
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
